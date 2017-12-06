import * as FirebaseFirestore from '@google-cloud/firestore'
import { read } from 'fs';
var firestore: FirebaseFirestore.Firestore
export module Pring {

    export function initialize(options?: any) {
        firestore = new FirebaseFirestore.Firestore(options)
    }

    export enum BatchType {
        save,
        update,
        delete
    }

    export interface Batchable {
        pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch
    }

    export interface ValueProtocol {
        value(): any
        setValue(value: any, key: String)
    }

    export interface Document extends Batchable, ValueProtocol {
        version: Number
        modelName: String
        path: String
        id: String
        reference: FirebaseFirestore.DocumentReference
        createdAt: Date
        updatedAt: Date
        init(snapshot: FirebaseFirestore.DocumentSnapshot)
        getVersion(): Number
        getModelName(): String
        getPath(): String
        value(): any
        rawValue(): any
    }

    export class Base implements Document {

        static getReference(): FirebaseFirestore.CollectionReference {
            return firestore.collection(this.getPath().toString())
        }

        static getVersion(): Number {
            return 1
        }

        static getModelName(): String {
            return this.toString().split('(' || /s+/)[0].split(' ' || /s+/)[1].toLowerCase()
        }

        static getPath(): String {
            return `version/${this.getVersion()}/${this.getModelName()}`
        }

        // static get<T extends Base>(id: String, done: (document: T) => void): void {
        //     firestore.doc(`${this.getPath()}/${id}`).get().then(snapshot => {
        //         let document = new this() as T
        //         document.init(snapshot)
        //         done(document)
        //     })
        // }

        static get<T extends Base>(id: String): Promise<T> {
            return new Promise<T>((resolve, reject) => {
                firestore.doc(`${this.getPath()}/${id}`).get().then(snapshot => {
                    let document = new this() as T
                    document.init(snapshot)
                    resolve(document)
                }).catch(error => {
                    reject(error)
                })
            })
        }


        public version: Number

        public modelName: String

        public path: String

        public reference: FirebaseFirestore.DocumentReference

        public id: String

        public createdAt: Date

        public updatedAt: Date

        public isSaved: Boolean = false

        constructor(id?: String) {
            this.version = this.getVersion()
            this.modelName = this.getModelName()
            this.id = id || firestore.collection(`version/${this.version}/${this.modelName}`).doc().id
            this.path = this.getPath()
            this.reference = this.getReference()
            this._init()
        }

        self(): this {
            return this
        }

        private _init() {
            let properties = this.getProperties()
            for (var prop in properties) {
                let key = properties[prop].toString()
                let descriptor = Object.getOwnPropertyDescriptor(this, key)
                let value = descriptor.value
                if (typeof value === "object") {
                    let collection: SubCollection = value as SubCollection
                    collection.setParent(this, key)
                }
            }
        }

        init(snapshot: FirebaseFirestore.DocumentSnapshot) {
            // ID
            let id = snapshot.id
            Object.defineProperty(this, "id", {
                value: id,
                writable: true,
                enumerable: true,
                configurable: true
            })

            let properties = this.getProperties()
            let data = snapshot.data()
            for (var prop in properties) {
                let key = properties[prop].toString()
                let descriptor = Object.getOwnPropertyDescriptor(this, key)
                let value = data[key]
                if (typeof descriptor.value === "object") {
                    let collection: SubCollection = descriptor.value as SubCollection
                    collection.setParent(this, key)
                    collection.setValue(value, key)
                } else {
                    Object.defineProperty(this, key, {
                        value: value,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    })
                }
            }

            // Properties
            this.path = this.getPath()
            this.reference = this.getReference()
            this.isSaved = true
        }

        getVersion(): Number {
            return 1
        }

        getModelName(): String {
            return this.constructor.toString().split('(' || /s+/)[0].split(' ' || /s+/)[1].toLowerCase()
        }

        getPath(): String {
            return `version/${this.version}/${this.modelName}/${this.id}`
        }

        getReference(): FirebaseFirestore.DocumentReference {
            return firestore.doc(this.getPath().toString())
        }

        getSystemProperties(): String[] {
            return ["version", "modelName", "path", "id", "reference", "isSaved"]
        }

        getProperties(): String[] {
            var properties = Object.getOwnPropertyNames(this)
            const that = this
            return properties.filter(function (v) {
                return (that.getSystemProperties().indexOf(v) == -1)
            })
        }

        setValue(value: any, key: String) {

        }

        rawValue(): any {
            let properties = this.getProperties()
            var values = {}
            for (var prop in properties) {
                let key = properties[prop].toString()
                let descriptor = Object.getOwnPropertyDescriptor(this, key)
                let value = descriptor.value

                if (typeof value === "object") {
                    let collection: ValueProtocol = value as ValueProtocol
                    values[key] = collection.value()
                } else {
                    values[key] = value
                }
            }
            return values
        }

        value(): any {
            var values: any = this.rawValue()
            values["createdAt"] = FirebaseFirestore.FieldValue.serverTimestamp()
            values["updatedAt"] = FirebaseFirestore.FieldValue.serverTimestamp()
            return values
        }

        pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch {
            var batch = batch || firestore.batch()
            let reference = this.reference
            switch (type) {
                case BatchType.save:
                    batch.set(reference, this.value())
                    return batch
                case BatchType.update:
                    batch.update(reference, this.value())
                    return batch
                case BatchType.delete:
                    batch.delete(reference)
                    return batch
            }
        }

        save(): Promise<FirebaseFirestore.WriteResult[]> {
            this._init()
            var batch = this.pack(BatchType.save)
            let properties = this.getProperties()
            for (var prop in properties) {
                let key = properties[prop].toString()
                let descriptor = Object.getOwnPropertyDescriptor(this, key)
                let value = descriptor.value

                if (typeof value === "object") {
                    var collection: SubCollection = value as SubCollection
                    var batchable: Batchable = value as Batchable
                    batchable.pack(BatchType.save, batch)
                }
            }
            return batch.commit()
        }

        update(): Promise<FirebaseFirestore.WriteResult> {
            return this.reference.update(this.value())
        }

        delete(): Promise<FirebaseFirestore.WriteResult> {
            return this.reference.delete()
        }
    }

    export interface SubCollection extends ValueProtocol {
        path: String
        reference: FirebaseFirestore.CollectionReference
        key: String
        setParent(parent: Base, key: String)
    }

    export class ReferenceCollection<T extends Document> implements SubCollection, Batchable {

        public path: String

        public reference: FirebaseFirestore.CollectionReference

        public parent: Base

        public key: String

        public objects: T[] = []

        private _count: Number = 0

        isSaved(): Boolean {
            return this.parent.isSaved
        }

        setParent(parent: Base, key: String) {
            this.parent = parent
            this.key = key
            this.path = this.getPath()
            this.reference = this.getReference()
        }

        getPath(): String {
            return `${this.parent.path}/${this.key}`
        }

        getReference(): FirebaseFirestore.CollectionReference {
            return firestore.collection(this.getPath().toString())
        }

        insert(newMember: T) {
            this.objects.push(newMember)
        }

        forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any) {
            this.objects.forEach(callbackfn)
        }

        count(): Number {
            return this.isSaved() ? this._count : this.objects.length
        }

        value(): any {
            return { "count": this.count() }
        }

        setValue(value: any, key: String) {
            this._count = value["count"] || 0
        }

        pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch {
            var batch = batch || firestore.batch()
            switch (type) {
                case BatchType.save:
                    this.forEach(document => {
                        let value = {
                            createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
                            updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                        }
                        let reference = this.reference.doc(document.id.toString())
                        document.pack(type, batch).set(reference, value)
                    })
                    return batch
                case BatchType.update:
                    this.forEach(document => {
                        let value = {
                            updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                        }
                        let reference = this.reference.doc(document.id.toString())
                        document.pack(type, batch).update(reference, value)
                    })
                    return batch
                case BatchType.delete:
                    this.forEach(document => {
                        let reference = this.reference.doc(document.id.toString())
                        batch.delete(reference)
                    })
                    return batch
            }
        }
    }
}