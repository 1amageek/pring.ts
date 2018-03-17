import * as functions from 'firebase-functions'
import * as FirebaseFirestore from '@google-cloud/firestore'
import * as UUID from 'uuid'
import { } from "reflect-metadata"

import { firestore } from './index'
import { SubCollection } from './subCollection'
import { NestedCollection } from './nestedCollection'
import { ReferenceCollection } from './referenceCollection'
import { File } from './file'
import { Batchable, BatchType } from './batchable'

const propertyMetadataKey = "property"//Symbol("property")

export const property = <T extends Document>(target: T, propertyKey) => {
    const properties = Reflect.getMetadata(propertyMetadataKey, target) || []
    properties.push(propertyKey)
    Reflect.defineMetadata(propertyMetadataKey, properties, target)
}

export interface ValueProtocol {
    value(): any
    setValue(value: any, key: string)
}

export interface Document extends Batchable, ValueProtocol {
    version: number
    modelName: string
    path: string
    id: string
    reference: FirebaseFirestore.DocumentReference
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
    reference: FirebaseFirestore.CollectionReference
    key: string
    setParent(parent: Base, key: string)
}

export function isCollection(arg): Boolean {
    return (arg instanceof SubCollection) ||
        (arg instanceof NestedCollection) ||
        (arg instanceof ReferenceCollection)
}

export function isFile(arg): Boolean {
    return (arg instanceof File)
}

export type DocumentData = { [key: string]: any } | FirebaseFirestore.DocumentData | any

export type Snapshot = FirebaseFirestore.DocumentSnapshot | functions.firestore.DeltaDocumentSnapshot

export type DataOrSnapshot = DocumentData | Snapshot

/// Pring Base class
export class Base implements Document {

    static getTriggerPath(): string {
        return `/version/{version}/${this.getModelName()}/{id}`
    }

    static getTriggerDocument(): functions.firestore.DocumentBuilder {
        return functions.firestore.document(this.getTriggerPath())
    }

    static getReference(): FirebaseFirestore.CollectionReference {
        return firestore.collection(this.getPath())
    }

    static getVersion(): number {
        return 1
    }

    static getModelName(): string {
        return this.toString().split('(' || /s+/)[0].split(' ' || /s+/)[1].toLowerCase()
    }

    static getPath(): string {
        return `version/${this.getVersion()}/${this.getModelName()}`
    }

    static async get<T extends Base>(id: string, type: { new(snapshot: DataOrSnapshot): T }) {
        try {
            const snapshot: FirebaseFirestore.DocumentSnapshot = await firestore.doc(`${this.getPath()}/${id}`).get()
            if (snapshot.exists) {
                const document: T = new type(snapshot.id)
                document.setData(snapshot.data())
                document._updateValues = {}
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

    public reference: FirebaseFirestore.DocumentReference

    public id: string

    public createdAt: Date

    public updatedAt: Date

    public isSaved: Boolean = false

    public isLocalSaved: Boolean = false

    public batchID?: string

    // - basic 

    private _updateValues: { [key: string]: any } = {}

    private _defineProperty(key: string, value?: any) {
        let _value: any = value
        const descriptor: PropertyDescriptor = {
            enumerable: true,
            configurable: true,
            get: () => {
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

    constructor(id?: string, data?: DocumentData) {

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
            for (const key of properties) {
                this._defineProperty(key, data[key])
            }
            this.isSaved = true
        } else {
            for (const key of properties) {
                this._defineProperty(key)
            }
        }
    }

    setData(data: DocumentData) {
        const properties: string[] = this.getProperties()
        for (const key of properties) {
            this._defineProperty(key, data[key])
        }
    }

    shouldBeReplicated(): boolean {
        return false
    }

    getVersion(): number {
        return 1
    }

    getModelName(): string {
        return this.constructor.toString().split('(' || /s+/)[0].split(' ' || /s+/)[1].toLowerCase()
    }

    getPath(): string {
        return `version/${this.version}/${this.modelName}/${this.id}`
    }

    getReference(): FirebaseFirestore.DocumentReference {
        return firestore.doc(this.getPath())
    }

    getProperties(): string[] {
        return Reflect.getMetadata(propertyMetadataKey, this) || []
    }

    setValue(value: any, key: string) {
        this[key] = value
    }

    rawValue(): any {
        const properties = this.getProperties()
        const values = {}
        for (const key of properties) {
            const descriptor = Object.getOwnPropertyDescriptor(this, key)
            if (descriptor) {
                const value = descriptor.get()
                if ((value !== null) && (value !== undefined)) {
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
        return values
    }

    value(): any {
        const values: any = this.rawValue()
        if (this.isSaved) {
            values["updatedAt"] = FirebaseFirestore.FieldValue.serverTimestamp()
        } else {
            values["createdAt"] = FirebaseFirestore.FieldValue.serverTimestamp()
            values["updatedAt"] = FirebaseFirestore.FieldValue.serverTimestamp()
        }
        return values
    }

    pack(type: BatchType, batchID: string, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch {
        const _batch = batch || firestore.batch()
        if (batchID === this.batchID) {
            return _batch
        }
        this.batchID = batchID
        const reference = this.reference
        const properties = this.getProperties()
        switch (type) {
            case BatchType.save:
                _batch.set(reference, this.value())
                for (const key of properties) {
                    const descriptor = Object.getOwnPropertyDescriptor(this, key)
                    if (descriptor) {
                        const value = descriptor.get()
                        if (isCollection(value)) {
                            const collection: AnySubCollection = value as AnySubCollection
                            collection.setParent(this, key)
                            const batchable: Batchable = value as Batchable
                            batchable.pack(BatchType.save, batchID, _batch)
                        }
                    }
                }
                return _batch
            case BatchType.update:
                const updateValues = this._updateValues
                updateValues["updatedAt"] = FirebaseFirestore.FieldValue.serverTimestamp()
                _batch.update(reference, updateValues)
                for (const key of properties) {
                    const descriptor = Object.getOwnPropertyDescriptor(this, key)
                    if (descriptor) {
                        const value = descriptor.get()
                        if (isCollection(value)) {
                            const collection: AnySubCollection = value as AnySubCollection
                            collection.setParent(this, key)
                            const batchable: Batchable = value as Batchable
                            batchable.pack(BatchType.update, batchID, _batch)
                        }
                    }
                }
                return _batch
            case BatchType.delete:
                _batch.delete(reference)
                return _batch
        }
    }

    batch(type: BatchType, batchID: string) {
        if (batchID === this.batchID) {
            return
        }
        this.batchID = batchID
        const properties = this.getProperties()
        this.isSaved = true
        for (const key of properties) {
            const descriptor = Object.getOwnPropertyDescriptor(this, key)
            if (descriptor) {
                const value = descriptor.get()
                if (isCollection(value)) {
                    const collection: AnySubCollection = value as AnySubCollection
                    collection.setParent(this, key)
                    collection.batch(type, batchID)
                }
            }
        }
    }

    async save() {
        const batch = this.pack(BatchType.save, UUID.v4())
        try {
            const result = await batch.commit()
            this.batch(BatchType.save, UUID.v4())
            this._updateValues = {}
            return result
        } catch (error) {
            throw error
        }
    }

    async update() {
        const batch = this.pack(BatchType.update, UUID.v4())
        try {
            const result = await batch.commit()
            this.batch(BatchType.update, UUID.v4())
            this._updateValues = {}
            return result
        } catch (error) {
            throw error
        }
    }

    async delete() {
        return await this.reference.delete()
    }

    async fetch() {
        try {
            const snapshot = await this.reference.get()            
            const data = snapshot.data()
            if (data) {
                this.setData(data)
                this.isSaved = true
            }
            this._updateValues = {}
        } catch (error) {
            throw error
        }
    }
}