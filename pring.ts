import * as FirebaseFirestore from '@google-cloud/firestore'

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

        _init() {
            let properties = this.getProperties()
            for (var prop in properties) {
                let key = properties[prop].toString()
                let descriptor = Object.getOwnPropertyDescriptor(this, key)
                let value = descriptor.value
                if (isCollection(value)) {         
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

            var keys = Object.keys(snapshot.data());
            let data = snapshot.data()
            keys.forEach(key => {
                let descriptor = Object.getOwnPropertyDescriptor(this, key)
                let value = data[key]
                if (descriptor && isCollection(descriptor.value)) {
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
            })

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

                if (isCollection(value)) {
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
            if (this.isSaved) {
                values["updatedAt"] = FirebaseFirestore.FieldValue.serverTimestamp()
            } else {
                values["createdAt"] = FirebaseFirestore.FieldValue.serverTimestamp()
                values["updatedAt"] = FirebaseFirestore.FieldValue.serverTimestamp()
            }
            return values
        }

        pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch {
            var batch = batch || firestore.batch()
            const reference = this.reference
            const properties = this.getProperties()
            switch (type) {
                case BatchType.save:
                    batch.set(reference, this.value())
                    for (var prop in properties) {
                        let key = properties[prop].toString()
                        let descriptor = Object.getOwnPropertyDescriptor(this, key)
                        let value = descriptor.value

                        if (isCollection(value)) {
                            var collection: SubCollection = value as SubCollection
                            collection.setParent(this, key)
                            var batchable: Batchable = value as Batchable
                            batchable.pack(BatchType.save, batch)
                        }
                    }
                    return batch
                case BatchType.update:
                    batch.update(reference, this.value())
                    for (var prop in properties) {
                        let key = properties[prop].toString()
                        let descriptor = Object.getOwnPropertyDescriptor(this, key)
                        let value = descriptor.value

                        if (isCollection(value)) {
                            var collection: SubCollection = value as SubCollection
                            collection.setParent(this, key)
                            var batchable: Batchable = value as Batchable
                            batchable.pack(BatchType.update, batch)
                        }
                    }
                    return batch
                case BatchType.delete:
                    batch.delete(reference)
                    return batch
            }
        }

        async save() {
            this._init()
            var batch = this.pack(BatchType.save)
            try {
                const result = await batch.commit()
                this.isSaved = true
                return result
            } catch (error) {
                throw error
            }
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

    function isCollection(arg): Boolean {
        return (arg instanceof ReferenceCollection) || (arg instanceof NestedCollection)
    }

    export class ReferenceCollection<T extends Base> implements SubCollection, Batchable {

        public path: String

        public reference: FirebaseFirestore.CollectionReference

        public parent: Base

        public key: String

        public objects: T[] = []

        private _count: Number = 0

        constructor(parent: Base) {
            this.parent = parent
            parent._init()
        }

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

        async insert(newMember: T) {
            if (this.isSaved()) {
                let reference = newMember.reference
                let parentRef = this.parent.reference
                let key = this.key.toString()
                var count = 0
                try {
                    const result = await firestore.runTransaction((transaction) => {
                        return transaction.get(parentRef).then((document) => {
                            const data = document.data()
                            const subCollection = data[key] || { "count": 0 }
                            const oldCount = subCollection["count"] || 0
                            count = oldCount + 1
                            transaction.update(parentRef, { [key]: { "count": count } })
                        })
                    })
                    this._count = count
                    var batch = firestore.batch()
                    if (newMember.isSaved) {
                        return batch.update(reference, newMember.value()).commit()
                    } else {
                        return batch.create(reference, newMember.value()).commit()
                    }
                } catch (error) {
                    return error
                }
            } else {
                this.objects.push(newMember)
                return
            }
        }

        async merge(newMembers: T[]) {
            if (this.isSaved()) {
                const length = newMembers.length
                if (length > 0) {
                    let parentRef = this.parent.reference
                    let key = this.key.toString()
                    var count = 0
                    try {
                        const result = await firestore.runTransaction((transaction) => {
                            return transaction.get(parentRef).then((document) => {
                                const data = document.data()
                                const subCollection = data[key] || { "count": 0 }
                                const oldCount = subCollection["count"] || 0
                                count = oldCount + length
                                transaction.update(parentRef, { [key]: { "count": count } })
                            })
                        })
                        this._count = count
                        var batch = firestore.batch()

                        for (var i = 0; i < length; i++) {
                            let newMember = newMembers[i]
                            let reference = newMember.reference
                            if (newMember.isSaved) {
                                batch.update(reference, newMember.value())
                            } else {
                                batch.create(reference, newMember.value())
                            }
                        }
                        return batch.commit()
                    } catch (error) {
                        return error
                    }
                }
            } else {
                this.objects.concat(newMembers)
                return
            }
        }

        remove(member: T): Promise<Promise<FirebaseFirestore.WriteResult[] | null>> {
            if (this.isSaved()) {
                let reference = member.reference
                let parentRef = this.parent.reference
                let key = this.key.toString()
                var count = 0
                return new Promise((resolve, reject) => {
                    return firestore.runTransaction((transaction) => {
                        return transaction.get(parentRef).then((document) => {
                            const data = document.data()
                            const subCollection = data[key] || { "count": 0 }
                            const oldCount = subCollection["count"] || 0
                            count = oldCount - 1
                            transaction.update(parentRef, { [key]: { "count": count } })
                        })
                    }).then((result) => {
                        this._count = count
                        var batch = firestore.batch()
                        resolve(batch.delete(reference).commit())
                    }).catch((error) => {
                        reject(error)
                    })
                })

            } else {
                this.objects.some((v, i) => {
                    if (v.id == member.id) {
                        this.objects.splice(i, 1)
                        return true
                    }
                    return false
                })
                return new Promise((resolve, reject) => {
                    resolve()
                })
            }
        }

        contains(id: String): Promise<Boolean> {
            return new Promise<Boolean>((resolve, reject) => {
                this.reference.doc(id.toString()).get().then((snapshot) => {
                    resolve(snapshot.exists)
                }).catch((error) => {
                    reject(error)
                })
            })
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
            const self = this
            switch (type) {
                case BatchType.save:                    
                    this.forEach(document => {
                        let doc: T = document as T
                        if (document.isSaved) {
                            let value = {
                                updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                            }
                            let reference = self.reference.doc(document.id.toString())
                            document.pack(BatchType.update, batch).update(reference, value)
                        } else {
                            let value = {
                                createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
                                updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                            }
                            let reference = self.reference.doc(document.id.toString())
                            document.pack(BatchType.save, batch).set(reference, value)
                        }
                    })
                    return batch
                case BatchType.update:
                    this.forEach(document => {
                        let doc: T = document as T
                        if (document.isSaved) {
                            let value = {
                                updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                            }
                            let reference = self.reference.doc(document.id.toString())
                            document.pack(BatchType.update, batch).update(reference, value)
                        } else {
                            let value = {
                                createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
                                updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                            }
                            let reference = self.reference.doc(document.id.toString())
                            document.pack(BatchType.save, batch).set(reference, value)
                        }
                    })
                    return batch
                case BatchType.delete:
                    this.forEach(document => {
                        let reference = self.reference.doc(document.id.toString())
                        batch.delete(reference)
                    })
                    return batch
            }
        }
    }

    export class NestedCollection<T extends Base> implements SubCollection, Batchable {

        public path: String

        public reference: FirebaseFirestore.CollectionReference

        public parent: Base

        public key: String

        public objects: T[] = []

        private _count: Number = 0

        constructor(parent: Base) {
            this.parent = parent
            parent._init()
        }

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

        async insert(newMember: T) {
            if (this.isSaved()) {
                let reference = this.reference.doc(newMember.id.toString())
                let parentRef = this.parent.reference
                let key = this.key.toString()
                var count = 0
                try {
                    const result = await firestore.runTransaction((transaction) => {
                        return transaction.get(parentRef).then((document) => {
                            const data = document.data()
                            const subCollection = data[key] || { "count": 0 }
                            const oldCount = subCollection["count"] || 0
                            count = oldCount + 1
                            transaction.update(parentRef, { [key]: { "count": count } })
                        })
                    })
                    this._count = count
                    var batch = firestore.batch()
                    if (newMember.isSaved) {
                        return batch.update(reference, newMember.value()).commit()
                    } else {
                        return batch.create(reference, newMember.value()).commit()
                    }
                } catch (error) {
                    return error
                }
            } else {
                this.objects.push(newMember)
                return
            }
        }

        async merge(newMembers: T[]) {
            if (this.isSaved()) {
                const length = newMembers.length
                if (length > 0) {
                    let parentRef = this.parent.reference
                    let key = this.key.toString()
                    var count = 0
                    try {
                        const result = await firestore.runTransaction((transaction) => {
                            return transaction.get(parentRef).then((document) => {
                                const data = document.data()
                                const subCollection = data[key] || { "count": 0 }
                                const oldCount = subCollection["count"] || 0
                                count = oldCount + length
                                transaction.update(parentRef, { [key]: { "count": count } })
                            })
                        })
                        this._count = count
                        var batch = firestore.batch()

                        for (var i = 0; i < length; i++) {
                            let newMember = newMembers[i]
                            let reference = this.reference.doc(newMember.id.toString())
                            if (newMember.isSaved) {
                                batch.update(reference, newMember.value())
                            } else {
                                batch.create(reference, newMember.value())
                            }
                        }
                        return batch.commit()
                    } catch (error) {
                        return error
                    }
                }
            } else {
                this.objects.concat(newMembers)
                return
            }
        }

        remove(member: T): Promise<Promise<FirebaseFirestore.WriteResult[] | null>> {
            if (this.isSaved()) {
                let reference = this.reference.doc(member.id.toString())
                let parentRef = this.parent.reference
                let key = this.key.toString()
                var count = 0
                return new Promise((resolve, reject) => {
                    return firestore.runTransaction((transaction) => {
                        return transaction.get(parentRef).then((document) => {
                            const data = document.data()
                            const subCollection = data[key] || { "count": 0 }
                            const oldCount = subCollection["count"] || 0
                            count = oldCount - 1
                            transaction.update(parentRef, { [key]: { "count": count } })
                        })
                    }).then((result) => {
                        this._count = count
                        var batch = firestore.batch()
                        resolve(batch.delete(reference).commit())
                    }).catch((error) => {
                        reject(error)
                    })
                })
            } else {
                this.objects.some((v, i) => {
                    if (v.id == member.id) {
                        this.objects.splice(i, 1)
                        return true
                    }
                    return false
                })
                return new Promise((resolve, reject) => {
                    resolve()
                })
            }
        }

        contains(id: String): Promise<Boolean> {
            return new Promise<Boolean>((resolve, reject) => {
                this.reference.doc(id.toString()).get().then((snapshot) => {
                    resolve(snapshot.exists)
                }).catch((error) => {
                    reject(error)
                })
            })
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
            const self = this
            switch (type) {
                case BatchType.save:
                    this.forEach(document => {
                        let doc: T = document as T
                        if (document.isSaved) {
                            let reference = self.reference.doc(document.id.toString())
                            batch.update(reference, document.value())
                        } else {
                            let reference = self.reference.doc(document.id.toString())
                            batch.set(reference, document.value())
                        }
                    })
                    return batch
                case BatchType.update:
                    this.forEach(document => {
                        let doc: T = document as T
                        if (document.isSaved) {
                            let reference = self.reference.doc(document.id.toString())
                            batch.update(reference, document.value())
                        } else {
                            let reference = self.reference.doc(document.id.toString())
                            batch.set(reference, document.value())
                        }
                    })
                    return batch
                case BatchType.delete:
                    this.forEach(document => {
                        let reference = self.reference.doc(document.id.toString())
                        batch.delete(reference)
                    })
                    return batch
            }
        }
    }
}