import * as UUID from 'uuid'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'reflect-metadata'

import { firestore } from './index'
import { SubCollection } from './subCollection'
import { NestedCollection } from './nestedCollection'
import { ReferenceCollection } from './referenceCollection'
import { File } from './file'
import { List } from './list'
import { Batchable, BatchType } from './batch'
import * as DataSourceQuery from './query'

export type Firestore = firebase.firestore.Firestore
export type FieldValue = firebase.firestore.FieldValue
export type CollectionReference = firebase.firestore.CollectionReference
export type DocumentReference = firebase.firestore.DocumentReference
export type DocumentSnapshot = firebase.firestore.DocumentSnapshot
export type Query = firebase.firestore.Query
export type QuerySnapshot = firebase.firestore.QuerySnapshot
export type WriteBatch = firebase.firestore.WriteBatch
export type SetOptions = firebase.firestore.SetOptions
export type UpdateData = firebase.firestore.UpdateData
export type FieldPath = firebase.firestore.FieldPath
export type Transaction = firebase.firestore.Transaction
export type Timestamp = firebase.firestore.Timestamp
export type DocumentData = { createdAt: Date, updatedAt: Date } | { [key: string]: any } | firebase.firestore.DocumentData
export type DataOrSnapshot = DocumentData | DocumentSnapshot | DocumentSnapshot
export type DateType = 'createdAt' | 'updatedAt'
export type WhereFilterOp = firebase.firestore.WhereFilterOp
export type OrderByDirection = firebase.firestore.OrderByDirection
export type GetOptions = firebase.firestore.GetOptions
export type DocumentChange = firebase.firestore.DocumentChange
export type QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot

export const timestamp = firebase.firestore.FieldValue.serverTimestamp()

const propertyMetadataKey = Symbol('property')

export const property = <T extends Document>(target: T, propertyKey: string) => {
    const properties = Reflect.getMetadata(propertyMetadataKey, target) || []
    properties.push(propertyKey)
    Reflect.defineMetadata(propertyMetadataKey, properties, target)
}

export interface ValueProtocol {
    value(): any
    updateValue(): any
    setValue(value: any, key: string): void
}

export interface FileData {
    mimeType: string
    name: string
    url: string
    additionalData?: { [key: string]: any }
}

export interface Document extends Batchable, ValueProtocol {
    [index: string]: any | null | undefined
    version: number
    modelName: string
    path: string
    id: string
    reference: DocumentReference
    createdAt: Timestamp
    updatedAt: Timestamp
    getVersion(): number
    getModelName(): string
    getPath(): string
    value(): any
}

export interface AnySubCollection extends Batchable {
    path: string
    reference: CollectionReference
    key: string
    setParent<T extends Base>(parent: T, key: string): void
}

export interface AnyList {
    key: string
    value(): { [key: string]: any }
    updateValue(): { [key: string]: any }
    setValue(value: { [key: string]: any }): void
    setParent<T extends Base>(parent: T, key: string): void
    clean(): void
}

export function isList(arg: any): boolean {
    return (arg instanceof List)
}

export function isCollection(arg: any): boolean {
    return (arg instanceof SubCollection) ||
        (arg instanceof NestedCollection) ||
        (arg instanceof ReferenceCollection)
}

export function isFile(arg: any): boolean {
    return (arg instanceof File)
}

export function isFileType(arg: any): boolean {
    if (arg instanceof Object) {
        return ((arg as Object).hasOwnProperty('mimeType') &&
            (arg as Object).hasOwnProperty('name') &&
            (arg as Object).hasOwnProperty('url'))
    } else {
        return false
    }
}

export function isTimestamp(arg: any): boolean {
    return (arg instanceof firebase.firestore.Timestamp)
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
        return new DataSourceQuery.Query(this.getReference(), this.getReference(), this)
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

    public createdAt!: Timestamp

    public updatedAt!: Timestamp

    public isSaved: boolean = false

    public isLocalSaved: boolean = false

    public batchID?: string

    private _updateValues: { [key: string]: any } = {}

    public constructor(id?: string, data?: DocumentData) {
        // set pring object base data
        this.version = this.getVersion()
        this.modelName = this.getModelName()

        if (!firestore) {
            throw Error('[Pring] Pring is not initialized.')
        }

        // Set reference
        this.id = id || firestore.collection(`version/${this.version}/${this.modelName}`).doc().id
        this.path = this.getPath()
        this.reference = this.getReference()

        // Pring properties define
        const properties: string[] = Reflect.getMetadata(propertyMetadataKey, this) || []
        if (data) {
            for (const prop of properties) {
                const key: (keyof DocumentData) = prop as (keyof DocumentData)
                const value = data[key]
                if (isFileType(value)) {
                    const file: File = new File()
                    file.init(value)
                    this._defineProperty(key, file)
                } else {
                    this._defineProperty(key, value)
                }
            }
            const keys = Object.keys(data)
            if (keys.includes('createdAt')) {
                const value = data['createdAt']
                this._defineProperty('createdAt', value)
            }
            if (keys.includes('updatedAt')) {
                const value = data['updatedAt']
                this._defineProperty('updatedAt', value)
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
            this._defineProperty('createdAt')
            this._prop['createdAt'] = data.createdAt
        }
        if (data.updatedAt) {
            this._defineProperty('updatedAt')
            this._prop['updatedAt'] = data.updatedAt
        }
        const properties: string[] = this.getProperties()
        for (const prop of properties) {
            const key: (keyof DocumentData) = prop as (keyof DocumentData)
            const value = data[key]
            if (!isUndefined(value)) {
                if (isFileType(value)) {
                    const file: File = new File()
                    file.init(value)
                    this._defineProperty(key, file)
                } else {
                    const prop = this._prop[key]
                    if (isList(prop)) {
                        const list = prop as AnyList
                        list.setValue(value)
                    } else {
                        this._prop[key] = value
                    }
                }
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
                        } else if (isList(value)) {
                            const list: AnyList = value as AnyList
                            values[key] = list.value()
                        } else if (isFile(value)) {
                            const file: ValueProtocol = value as ValueProtocol
                            values[key] = file.value()
                        } else if (value instanceof Date) {
                            console.log(
                                '******************** Warnings ********************\n' +
                                '\n' +
                                ' pring-admin.ts is not support `Date` type.\n' +
                                ' Please migrate `Date` type to `Timestamp` type.\n' +
                                '\n' +
                                '**************************************************\n'
                            )
                        } else {
                            values[key] = value
                        }
                    }
                }
            }
        }
        return values
    }

    public value(): any {
        const values: DocumentData = this.rawValue()
        const updatedAt: (keyof DocumentData) = 'updatedAt'
        const createdAt: (keyof DocumentData) = 'createdAt'
        values[updatedAt] = this.updatedAt || firebase.firestore.Timestamp.fromDate(new Date())
        values[createdAt] = this.createdAt || firebase.firestore.Timestamp.fromDate(new Date())
        return values
    }

    private _value(): DocumentData {
        const values: DocumentData = this.rawValue()
        if (this.isSaved) {
            const updatedAt: (keyof DocumentData) = 'updatedAt'
            values[updatedAt] = firebase.firestore.FieldValue.serverTimestamp()
        } else {
            const updatedAt: (keyof DocumentData) = 'updatedAt'
            const createdAt: (keyof DocumentData) = 'createdAt'
            values[updatedAt] = this.updatedAt || firebase.firestore.FieldValue.serverTimestamp()
            values[createdAt] = this.updatedAt || firebase.firestore.FieldValue.serverTimestamp()
        }
        return values
    }

    public updateValue(): any {
        const properties = this.getProperties()
        const updateValues = this._updateValues as any
        for (const key of properties) {
            const descriptor = Object.getOwnPropertyDescriptor(this, key)
            if (descriptor) {
                if (descriptor.get) {
                    const value = descriptor.get()
                    if (!isUndefined(value)) {
                        if (isList(value)) {
                            const updateValue = value.updateValue()
                            if (Object.keys(updateValue).length > 0) {
                                updateValues[key] = updateValue
                            }
                        } else if (isFile(value)) {
                            const file: File = value as File
                            if (Object.keys(file).length) {
                                updateValues[key] = file.value()
                            }
                        }
                    }
                }
            }
        }
        return updateValues
    }

    private _updateValue(): any {
        const updateValue: any = this.updateValue()
        const updatedAt: (keyof DocumentData) = 'updatedAt'
        updateValue[updatedAt] = firebase.firestore.FieldValue.serverTimestamp()
        return updateValue
    }

    public pack(type: BatchType, batchID?: string, writeBatch?: WriteBatch): WriteBatch {
        const _writeBatch: WriteBatch = writeBatch || firestore.batch()

        // If a batch ID is not specified, it is generated
        const _batchID = batchID || UUID.v4()

        // If you do not process already packed documents
        if (_batchID === this.batchID) {
            return _writeBatch
        }

        this.batchID = _batchID
        const reference = this.reference
        const properties = this.getProperties()
        switch (type) {
            case BatchType.save:
                _writeBatch.set(reference, this._value(), { merge: true })
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
                return _writeBatch
            case BatchType.update:

                if (this.isSaved) {
                    const updateValue = this.updateValue()
                    if (Object.keys(updateValue).length > 0) {
                        const updateValue: any = this._updateValue()
                        _writeBatch.set(reference, updateValue, { merge: true })
                    }
                } else {
                    const reference = this.reference
                    _writeBatch.set(reference, this._value(), { merge: true })
                }

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
                return _writeBatch
            case BatchType.delete:
                _writeBatch.delete(reference)
                return _writeBatch
        }
    }

    public batch(type: BatchType, batchID: string = UUID.v4()) {
        if (batchID === this.batchID) {
            return
        }
        this.batchID = batchID
        const properties = this.getProperties()
        this.isSaved = true
        this._updateValues = {}
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
                        if (isFile(value)) {
                            const file: File = value as File
                            file.resetUpdateValue()
                        }
                        if (isList(value)) {
                            const list: AnyList = value as AnyList
                            list.clean()
                        }
                    }
                }
            }
        }
    }

    public setParent<T extends Base>(parent: SubCollection<T>) {
        this.path = `${parent.path}/${this.id}`
        this.setReference(firestore.doc(this.path))
    }

    public setReference(reference: DocumentReference) {
        this.reference = reference
        const properties = this.getProperties()
        for (const key of properties) {
            const descriptor = Object.getOwnPropertyDescriptor(this, key)
            if (descriptor) {
                if (descriptor.get) {
                    const value = descriptor.get()
                    if (value) {
                        if (isCollection(value)) {
                            const collection: AnySubCollection = value as AnySubCollection
                            collection.setParent(this, key)
                        }
                    }
                }
            }
        }
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
                snapshot = await transaction.get(this.reference)
            } else {
                snapshot = await this.reference.get()
            }
            const data = snapshot.data()
            if (data) {
                this.setData(data)
                this.isSaved = true
            }
            return this
        } catch (error) {
            throw error
        }
    }

    private _prop: { [key: string]: any } = {}

    private _defineProperty<T extends keyof ThisType<this>>(key: T | DateType, value?: any) {
        const descriptor: PropertyDescriptor = {
            enumerable: true,
            configurable: true,
            get: () => {
                return this._prop[key]
            },
            set: (newValue) => {
                if (isCollection(newValue)) {
                    const collection: AnySubCollection = newValue as AnySubCollection
                    collection.setParent(this, key)
                } else if (isList(newValue)) {
                    const list: AnyList = newValue as AnyList
                    list.setParent(this, key)
                } else if (isFile(newValue)) {
                    const file: ValueProtocol = newValue as ValueProtocol
                    this._updateValues[key] = file.value()
                } else {
                    this._updateValues[key] = newValue
                }
                this._prop[key] = newValue
            }
        }
        Object.defineProperty(this, key, descriptor)
    }
}
