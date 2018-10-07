import * as UUID from 'uuid'
import * as FirebaseFirestore from '@google-cloud/firestore'
import * as firebase from 'firebase/app'
import 'firebase/firestore'
import "reflect-metadata"

import { firestore, timestamp } from './index';
import { SubCollection } from './subCollection'
import { NestedCollection } from './nestedCollection'
import { ReferenceCollection } from './referenceCollection'
import { File } from './file'
import { Batchable, BatchType, Batch } from './batch'
import * as DataSourceQuery from './query'

export type Firestore = firebase.firestore.Firestore | FirebaseFirestore.Firestore
export type FieldValue = firebase.firestore.FieldValue | FirebaseFirestore.FieldValue
export type CollectionReference = firebase.firestore.CollectionReference | FirebaseFirestore.CollectionReference
export type DocumentReference = firebase.firestore.DocumentReference | FirebaseFirestore.DocumentReference
export type DocumentSnapshot = firebase.firestore.DocumentSnapshot | FirebaseFirestore.DocumentSnapshot
export type Query = firebase.firestore.Query | FirebaseFirestore.Query
export type QuerySnapshot = firebase.firestore.QuerySnapshot | FirebaseFirestore.QuerySnapshot
export type WriteBatch = firebase.firestore.WriteBatch | FirebaseFirestore.WriteBatch
export type SetOptions = firebase.firestore.SetOptions | FirebaseFirestore.SetOptions
export type UpdateData = firebase.firestore.UpdateData | FirebaseFirestore.UpdateData
export type FieldPath = firebase.firestore.FieldPath | FirebaseFirestore.FieldPath
export type Transaction = firebase.firestore.Transaction | FirebaseFirestore.Transaction
export type DocumentData = { createdAt: Date, updatedAt: Date } |
{ [key: string]: any } | firebase.firestore.DocumentData | FirebaseFirestore.DocumentData
export type DataOrSnapshot = DocumentData | DocumentSnapshot | DocumentSnapshot
export type DateType = 'createdAt' | 'updatedAt'
export type WhereFilterOp = firebase.firestore.WhereFilterOp | FirebaseFirestore.WhereFilterOp
export type OrderByDirection = firebase.firestore.OrderByDirection | FirebaseFirestore.OrderByDirection
export type GetOptions = firebase.firestore.GetOptions
export type DocumentChange = firebase.firestore.DocumentChange | FirebaseFirestore.DocumentChange
export type QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot | FirebaseFirestore.QueryDocumentSnapshot

const propertyMetadataKey = Symbol("property")

export const property = <T extends Document>(target: T, propertyKey: string) => {
    const properties = Reflect.getMetadata(propertyMetadataKey, target) || []
    properties.push(propertyKey)
    Reflect.defineMetadata(propertyMetadataKey, properties, target)
}

export interface ValueProtocol {
    value(): any
    setValue(value: any, key: string): void
}

export interface FileData {
    mimeType: string
    name: string
    url: string
}

export interface Document extends Batchable, ValueProtocol {
    [index: string]: any | null | undefined
    version: number
    modelName: string
    path: string
    id: string
    reference: DocumentReference
    createdAt: Date
    updatedAt: Date
    getVersion(): number
    getModelName(): string
    getPath(): string
    value(): any
    rawValue(): any
}

export interface AnySubCollection extends Batchable {
    path: string
    reference: CollectionReference
    key: string
    setParent(parent: Base, key: string): void
}

export function isCollection(arg: any): boolean {
    return (arg instanceof SubCollection) ||
        (arg instanceof NestedCollection) ||
        (arg instanceof ReferenceCollection)
}

export function isFile(arg: any): boolean {
    return (arg instanceof File)
}

export function isTimestamp(arg: any): boolean {
    return (arg instanceof firebase.firestore.Timestamp) || (arg instanceof FirebaseFirestore.Timestamp)
}

export const isUndefined = (value: any): boolean => {
    return (value === null || value === undefined)
}

/// Pring Base class
export class Base implements Document {

    public static getTriggerPath(): string {
        return `/version/{version}/${this.getModelName()}/{id}`
    }

    public static getReference(): CollectionReference {
        return firestore.collection(this.getPath())
    }

    public static getVersion(): number {
        return 1
    }

    public static getModelName(): string {
        return this.toString().split('(' || /s+/)[0].split(' ' || /s+/)[1].toLowerCase()
    }

    public static getPath(): string {
        return `version/${this.getVersion()}/${this.getModelName()}`
    }

    public static query<T extends typeof Base>(this: T): DataSourceQuery.Query<T> {
        return new DataSourceQuery.Query(this)
    }

    public static async get<T extends typeof Base>(this: T, id: string) {
        try {
            const snapshot: DocumentSnapshot = await firestore.doc(`${this.getPath()}/${id}`).get()
            if (snapshot.exists) {
                const document = new this(snapshot.id, {}) as InstanceType<T>
                document.setData(snapshot.data()!)
                return document
            } else {
                return undefined
            }
        } catch (error) {
            throw error
        }
    }

    public version: number

    public modelName: string

    public path: string

    public reference: DocumentReference

    public id: string

    public createdAt!: Date

    public updatedAt!: Date

    public isSaved: boolean = false

    public isLocalSaved: boolean = false

    public batchID?: string

    private _updateValues: { [key: string]: any } = {}

    public constructor(id?: string, data?: DocumentData) {
        // set pring object base data
        this.version = this.getVersion()
        this.modelName = this.getModelName()

        // Set reference
        this.id = id || firestore.collection(`version/${this.version}/${this.modelName}`).doc().id
        this.path = this.getPath()
        this.reference = this.getReference()

        // Pring properties define
        const properties: string[] = Reflect.getMetadata(propertyMetadataKey, this) || []
        if (data) {
            for (const prop of properties) {
                const key: (keyof DocumentData) = prop as (keyof DocumentData)
                this._defineProperty(key, data[key])
            }
            this.isSaved = true
        } else {
            for (const prop of properties) {
                const key: (keyof DocumentData) = prop as (keyof DocumentData)
                this._defineProperty(key)
            }
        }
    }

    public setData(data: DocumentData) {
        if (data.createdAt) {
            this._defineProperty('createdAt', data.createdAt)
        }
        if (data.updatedAt) {
            this._defineProperty('updatedAt', data.updatedAt)
        }
        const properties: string[] = this.getProperties()
        for (const prop of properties) {
            const key: (keyof DocumentData) = prop as (keyof DocumentData)
            const value = data[key]
            if (!isUndefined(value)) {
                this._defineProperty(key, value)
            }
        }
        this._updateValues = {}
    }

    public shouldBeReplicated(): boolean {
        return false
    }

    public getVersion(): number {
        return 1
    }

    public getModelName(): string {
        return this.constructor.toString().split('(' || /s+/)[0].split(' ' || /s+/)[1].toLowerCase()
    }

    public getPath(): string {
        return `version/${this.version}/${this.modelName}/${this.id}`
    }

    public getReference(): DocumentReference {
        return firestore.doc(this.getPath())
    }

    public getProperties(): string[] {
        return Reflect.getMetadata(propertyMetadataKey, this) || []
    }

    public setValue<K extends keyof ThisType<this>>(value: any, key: K) {
        this[key] = value
    }

    public rawValue(): any {
        const properties = this.getProperties()
        const values: any = {}
        for (const key of properties) {
            const descriptor = Object.getOwnPropertyDescriptor(this, key)
            if (descriptor) {
                if (descriptor.get) {
                    const value = descriptor.get()
                    if (!isUndefined(value)) {
                        if (isCollection(value)) {
                            // Nothing
                        } else if (isFile(value)) {
                            const file: ValueProtocol = value as ValueProtocol
                            values[key] = file.value()
                        } else {
                            values[key] = value
                        }
                    }
                }
            }
        }
        return values
    }

    public value(): DocumentData {
        const values: DocumentData = this.rawValue()
        if (this.isSaved) {
            const updatedAt: (keyof DocumentData) = "updatedAt"
            values[updatedAt] = timestamp
        } else {
            const updatedAt: (keyof DocumentData) = "updatedAt"
            const createdAt: (keyof DocumentData) = "createdAt"
            values[updatedAt] = this.updatedAt || timestamp
            values[createdAt] = this.createdAt || timestamp
        }
        return values
    }

    public pack(type: BatchType, batchID?: string, writeBatch?: WriteBatch): WriteBatch {
        const _writeBatch: WriteBatch = writeBatch || firestore.batch()
        const _batch: Batch = new Batch(_writeBatch)

        // If a batch ID is not specified, it is generated
        const _batchID = batchID || UUID.v4()

        // If you do not process already packed documents
        if (_batchID === this.batchID) {
            return _batch.batch()
        }

        this.batchID = _batchID
        const reference = this.reference
        const properties = this.getProperties()
        switch (type) {
            case BatchType.save:
                _batch.set(reference, this.value(), { merge: true })
                for (const key of properties) {
                    const descriptor = Object.getOwnPropertyDescriptor(this, key)
                    if (descriptor) {
                        if (descriptor.get) {
                            const value = descriptor.get()
                            if (isCollection(value)) {
                                const collection: AnySubCollection = value as AnySubCollection
                                collection.setParent(this, key)
                                const batchable: Batchable = value as Batchable
                                batchable.pack(BatchType.save, _batchID, _writeBatch)
                            }
                        }
                    }
                }
                return _batch.batch()
            case BatchType.update:
                const updateValues: DocumentData = this._updateValues
                const updatedAt: (keyof DocumentData) = "updatedAt"
                updateValues[updatedAt] = timestamp
                _batch.update(reference, updateValues)
                for (const key of properties) {
                    const descriptor = Object.getOwnPropertyDescriptor(this, key)
                    if (descriptor) {
                        if (descriptor.get) {
                            const value = descriptor.get()
                            if (isCollection(value)) {
                                const collection: AnySubCollection = value as AnySubCollection
                                collection.setParent(this, key)
                                const batchable: Batchable = value as Batchable
                                batchable.pack(BatchType.update, _batchID, _writeBatch)
                            }
                        }
                    }
                }
                return _batch.batch()
            case BatchType.delete:
                _batch.delete(reference)
                return _batch.batch()
        }
    }

    public batch(type: BatchType, batchID: string = UUID.v4()) {
        if (batchID === this.batchID) {
            return
        }
        this.batchID = batchID
        const properties = this.getProperties()
        this.isSaved = true
        for (const key of properties) {
            const descriptor = Object.getOwnPropertyDescriptor(this, key)
            if (descriptor) {
                if (descriptor.get) {
                    const value = descriptor.get()
                    if (value) {
                        if (isCollection(value)) {
                            const collection: AnySubCollection = value as AnySubCollection
                            collection.setParent(this, key)
                            collection.batch(type, batchID)
                        }
                    }
                }
            }
        }
    }

    public setParent<T extends Base>(parent: NestedCollection<T>) {
        // Set reference
        this.path = `${parent.path}/${this.id}`
        this.reference = firestore.doc(this.path)
    }

    public async save() {
        const batch = this.pack(BatchType.save)
        try {
            const result = await batch.commit()
            this.batch(BatchType.save)
            this._updateValues = {}
            return result
        } catch (error) {
            throw error
        }
    }

    public async update() {
        const batch = this.pack(BatchType.update)
        try {
            const result = await batch.commit()
            this.batch(BatchType.update)
            this._updateValues = {}
            return result
        } catch (error) {
            throw error
        }
    }

    public async delete() {
        return await this.reference.delete()
    }

    public async fetch(transaction?: Transaction) {
        try {
            let snapshot!: DocumentSnapshot
            if (transaction) {
                if (transaction instanceof firebase.firestore.Transaction) {
                    snapshot = await transaction.get(this.reference as firebase.firestore.DocumentReference)
                }
                if (transaction instanceof FirebaseFirestore.Transaction) {
                    snapshot = await transaction.get(this.reference as FirebaseFirestore.DocumentReference)
                }
            } else {
                snapshot = await this.reference.get()
            }
            const data = snapshot.data()
            if (data) {
                this.setData(data)
                this.isSaved = true
            }
        } catch (error) {
            throw error
        }
    }

    private _defineProperty<T extends keyof ThisType<this>>(key: T | DateType, value?: any) {
        let _value: any = value
        const descriptor: PropertyDescriptor = {
            enumerable: true,
            configurable: true,
            get: () => {
                if (isTimestamp(_value)) {
                    return _value.toDate()
                }
                return _value
            },
            set: (newValue) => {
                _value = newValue
                if (isCollection(newValue)) {
                    const collection: AnySubCollection = newValue as AnySubCollection
                    collection.setParent(this, key)
                } else if (isFile(newValue)) {
                    const file: ValueProtocol = newValue as ValueProtocol
                    this._updateValues[key] = file.value()
                } else {
                    this._updateValues[key] = newValue
                }
            }
        }
        Object.defineProperty(this, key, descriptor)
    }
}
