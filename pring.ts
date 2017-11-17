import * as FirebaseFirestore from '@google-cloud/firestore'
var firestore: FirebaseFirestore.Firestore
export module Pring {

    export function initialize(options?: any) {
        firestore = new FirebaseFirestore.Firestore(options)
    }

    export interface Document {
        version: Number
        modelName: String
        path: String
        id: String
        createdAt: Date
        updatedAt: Date
        init(snapshot: FirebaseFirestore.DocumentSnapshot)
        getVersion(): Number
        getModelName(): String
        getPath(): String
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

        static get<T extends Base>(id: String, done: (document: T) => void): void {
            firestore.doc(`${this.getPath()}/${id}`).get().then(snapshot => {
                let document = new this() as T
                document.init(snapshot)
                done(document)
            })
        }

        public version: Number

        public modelName: String

        public path: String

        public reference: FirebaseFirestore.DocumentReference

        public id: String

        public createdAt: Date

        public updatedAt: Date

        constructor(id?: String) {
            this.version = this.getVersion()
            this.modelName = this.getModelName()
            this.id = id || firestore.collection(`version/${this.version}/${this.modelName}`).doc().id
            this.path = this.getPath()
            this.reference = this.getReference()
        }

        self(): this {
            return this
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

            // Properties
            let values = snapshot.data()
            for (var key in values) {
                let value = values[key]
                Object.defineProperty(this, key, {
                    value: value,
                    writable: true,
                    enumerable: true,
                    configurable: true
                })
            }
            this.path = this.getPath()
            this.reference = this.getReference()
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
            return ["version", "modelName", "path", "id", "reference"]
        }

        getProperties(): String[] {
            var properties = Object.getOwnPropertyNames(this)
            const that = this
            return properties.filter(function (v) {
                return (that.getSystemProperties().indexOf(v) == -1)
            })
        }

        save(): Promise<FirebaseFirestore.WriteResult> {
            let properties = this.getProperties()
            var values = {
                createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
                updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
            }
            for (var prop in properties) {
                let key = properties[prop].toString()
                let value = Object.getOwnPropertyDescriptor(this, key).value
                values[key] = value
            }
            return this.reference.set(values)
        }

        update(): Promise<FirebaseFirestore.WriteResult> {
            let properties = this.getProperties()
            var values = {
                updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
            }
            for (var prop in properties) {
                let key = properties[prop].toString()
                let value = Object.getOwnPropertyDescriptor(this, key).value
                values[key] = value
            }
            return this.reference.update(values)
        }

        delete(): Promise<FirebaseFirestore.WriteResult> {
            return this.reference.delete()
        }
    }
}