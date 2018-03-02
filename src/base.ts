import * as FirebaseFirestore from '@google-cloud/firestore'
import * as UUID from 'uuid'
import { DeltaDocumentSnapshot } from 'firebase-functions/lib/providers/firestore'
import "reflect-metadata"

import { firestore } from './index'
import { AnySubCollection } from './anySubCollection'
import { SubCollection } from './subCollection'
import { NestedCollection } from './nestedCollection'
import { ReferenceCollection } from './referenceCollection'
import { File } from './file'
import { Batchable, BatchType } from './batchable'

const functions = module.parent.exports.functions

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

// export interface Triggerable {
//     getTriggerPath(): string

//     getTriggerDocument(): functions.firestore.DocumentBuilder
//     /** Respond to all document writes (creates, updates, or deletes). */
//     onWrite(handler: (event: functions.Event<DeltaDocumentSnapshot>) => PromiseLike<any> | any): functions.CloudFunction<DeltaDocumentSnapshot>
//     /** Respond only to document creations. */
//     onCreate(handler: (event: functions.Event<DeltaDocumentSnapshot>) => PromiseLike<any> | any): functions.CloudFunction<DeltaDocumentSnapshot>
//     /** Respond only to document updates. */
//     onUpdate(handler: (event: functions.Event<DeltaDocumentSnapshot>) => PromiseLike<any> | any): functions.CloudFunction<DeltaDocumentSnapshot>
//     /** Respond only to document deletions. */
//     onDelete(handler: (event: functions.Event<DeltaDocumentSnapshot>) => PromiseLike<any> | any): functions.CloudFunction<DeltaDocumentSnapshot>
// }

export interface Document extends Batchable, ValueProtocol {
    version: number
    modelName: string
    path: string
    id: string
    reference: FirebaseFirestore.DocumentReference
    createdAt: Date
    updatedAt: Date
    init(snapshot: FirebaseFirestore.DocumentSnapshot | DeltaDocumentSnapshot)
    getVersion(): number
    getModelName(): string
    getPath(): string
    value(): any
    rawValue(): any
}

export function isCollection(arg): Boolean {
    return (arg instanceof SubCollection) ||
        (arg instanceof NestedCollection) ||
        (arg instanceof ReferenceCollection)
}

export function isFile(arg): Boolean {
    return (arg instanceof File)
}

export class Base implements Document {

    static getTriggerPath(): string {        
        return `/version/{version}/${this.getModelName()}/{id}`
    }

    static getTriggerDocument(): functions.firestore.DocumentBuilder {
        return functions.firestore.document(this.getTriggerPath())
    }

    /** Respond to all document writes (creates, updates, or deletes). */
    static onWrite(handler: (event: functions.Event<functions.firestore.DeltaDocumentSnapshot>) => PromiseLike<any> | any): functions.CloudFunction<functions.firestore.DeltaDocumentSnapshot> {
        return this.getTriggerDocument().onWrite(handler)
    }
    /** Respond only to document creations. */
    static onCreate(handler: (event: functions.Event<functions.firestore.DeltaDocumentSnapshot>) => PromiseLike<any> | any): functions.CloudFunction<functions.firestore.DeltaDocumentSnapshot> {
        return this.getTriggerDocument().onCreate(handler)
    }
    /** Respond only to document updates. */
    static onUpdate(handler: (event: functions.Event<functions.firestore.DeltaDocumentSnapshot>) => PromiseLike<any> | any): functions.CloudFunction<functions.firestore.DeltaDocumentSnapshot> {
        return this.getTriggerDocument().onUpdate(handler)
    }
    /** Respond only to document deletions. */
    static onDelete(handler: (event: functions.Event<functions.firestore.DeltaDocumentSnapshot>) => PromiseLike<any> | any): functions.CloudFunction<functions.firestore.DeltaDocumentSnapshot> {
        return this.getTriggerDocument().onDelete(handler)
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

    static self(): any {
        return new this()
    }

    static async get(id: string) {
        try {
            const snapshot = await firestore.doc(`${this.getPath()}/${id}`).get()
            const document = new this()
            document.init(snapshot)
            return document
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

    constructor(id?: string) {
        this.version = this.getVersion()
        this.modelName = this.getModelName()
        this.id = id || firestore.collection(`version/${this.version}/${this.modelName}`).doc().id
        this.path = this.getPath()
        this.reference = this.getReference()
    }

    self(): this {
        return this
    }

    _init() {
        const properties = this.getProperties()
        for (const prop in properties) {
            const key = properties[prop]
            const descriptor = Object.getOwnPropertyDescriptor(this, key)
            if (descriptor) {
                const value = descriptor.value
                if (isCollection(value)) {
                    const collection: AnySubCollection = value as AnySubCollection
                    collection.setParent(this, key)
                }
            }
        }
    }

    init(snapshot: FirebaseFirestore.DocumentSnapshot | DeltaDocumentSnapshot) {
        // ID
        const id = snapshot.id
        Object.defineProperty(this, "id", {
            value: id,
            writable: true,
            enumerable: true,
            configurable: true
        })

        const properties = this.getProperties()
        const data = snapshot.data()

        if (data) {
            for (const key of properties) {
                const descriptor = Object.getOwnPropertyDescriptor(this, key)
                const value = data[key]
                if (descriptor) {
                    if (isCollection(descriptor.value)) {
                        const collection: AnySubCollection = descriptor.value as AnySubCollection
                        collection.setParent(this, key)
                    } else {
                        Object.defineProperty(this, key, {
                            value: value,
                            writable: true,
                            enumerable: true,
                            configurable: true
                        })
                    }
                } else {
                    if (value) {
                        Object.defineProperty(this, key, {
                            value: value,
                            writable: true,
                            enumerable: true,
                            configurable: true
                        })
                    }
                }
            }
        }

        // Properties
        this.path = this.getPath()
        this.reference = this.getReference()
        this.isSaved = true
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
        for (const prop in properties) {
            const key = properties[prop]
            const descriptor = Object.getOwnPropertyDescriptor(this, key)
            if (descriptor) {
                const value = descriptor.value
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

    pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch {
        const _batch = batch || firestore.batch()
        const reference = this.reference
        const properties = this.getProperties()
        switch (type) {
            case BatchType.save:
                _batch.set(reference, this.value())
                for (const prop in properties) {
                    const key = properties[prop]
                    const descriptor = Object.getOwnPropertyDescriptor(this, key)
                    if (descriptor) {
                        const value = descriptor.value
                        if (isCollection(value)) {
                            const collection: AnySubCollection = value as AnySubCollection
                            collection.setParent(this, key)
                            const batchable: Batchable = value as Batchable
                            batchable.pack(BatchType.save, _batch)
                        }
                    }
                }
                return _batch
            case BatchType.update:
                _batch.update(reference, this.value())
                for (const prop in properties) {
                    const key = properties[prop]
                    const descriptor = Object.getOwnPropertyDescriptor(this, key)
                    if (descriptor) {
                        const value = descriptor.value
                        if (isCollection(value)) {
                            const collection: AnySubCollection = value as AnySubCollection
                            collection.setParent(this, key)
                            const batchable: Batchable = value as Batchable
                            batchable.pack(BatchType.update, _batch)
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
        for (const prop in properties) {
            const key = properties[prop]
            const descriptor = Object.getOwnPropertyDescriptor(this, key)
            if (descriptor) {
                const value = descriptor.value
                if (isCollection(value)) {
                    const collection: AnySubCollection = value as AnySubCollection
                    collection.setParent(this, key)
                    collection.batch(type, batchID)
                }
            }
        }
    }

    async save() {
        this._init()
        const batch = this.pack(BatchType.save)
        try {
            const result = await batch.commit()
            this.batch(BatchType.save, UUID.v4())
            return result
        } catch (error) {
            throw error
        }
    }

    async update() {
        this._init()
        const batch = this.pack(BatchType.update)
        try {
            const result = await batch.commit()
            this.batch(BatchType.update, UUID.v4())
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
            this.init(snapshot)
        } catch (error) {
            throw error
        }
    }
}