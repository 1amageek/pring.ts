import * as FirebaseFirestore from '@google-cloud/firestore'
import "reflect-metadata"
import { Document } from './test/test_document';

const propertyMetadataKey = "property"//Symbol("property")

export const property = <T extends Pring.Document>(target: T, propertyKey) => {
    var properties = Reflect.getMetadata(propertyMetadataKey, target) || []
    properties.push(propertyKey)
    Reflect.defineMetadata(propertyMetadataKey, properties, target)
}
  
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
        init(snapshot: FirebaseFirestore.DocumentSnapshot)
        getVersion(): number
        getModelName(): string
        getPath(): string
        value(): any
        rawValue(): any
    }

    export class Base implements Document {

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
            let properties = this.getProperties()
            for (var prop in properties) {
                let key = properties[prop]
                let descriptor = Object.getOwnPropertyDescriptor(this, key)
                if (descriptor) {
                    const value = descriptor.value
                    if (isCollection(value)) {
                        let collection: SubCollection = value as SubCollection
                        collection.setParent(this, key)
                    }
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
                let key = properties[prop]
                let descriptor = Object.getOwnPropertyDescriptor(this, key)
                let value = data[key]
                if (descriptor) {
                    if (isCollection(descriptor.value)) {
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
            return Reflect.getMetadata(propertyMetadataKey, this)
        }

        setValue(value: any, key: string) {

        }

        rawValue(): any {
            let properties = this.getProperties()
            var values = {}
            for (var prop in properties) {
                let key = properties[prop]
                let descriptor = Object.getOwnPropertyDescriptor(this, key)
                if (descriptor) {
                    let value = descriptor.value
                    if (isCollection(value)) {
                        let collection: ValueProtocol = value as ValueProtocol
                        values[key] = collection.value()
                    } else if (isFile(value)) {
                        let file: ValueProtocol = value as ValueProtocol
                        values[key] = file.value()
                    } else {
                        values[key] = value
                    }
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
                        let key = properties[prop]
                        let descriptor = Object.getOwnPropertyDescriptor(this, key)
                        if (descriptor) {
                            let value = descriptor.value
                            if (isCollection(value)) {
                                var collection: SubCollection = value as SubCollection
                                collection.setParent(this, key)
                                var batchable: Batchable = value as Batchable
                                batchable.pack(BatchType.save, batch)
                            }
                        }
                    }
                    return batch
                case BatchType.update:
                    batch.update(reference, this.value())
                    for (var prop in properties) {
                        let key = properties[prop]
                        let descriptor = Object.getOwnPropertyDescriptor(this, key)
                        if (descriptor) {
                            let value = descriptor.value
                            if (isCollection(value)) {
                                var collection: SubCollection = value as SubCollection
                                collection.setParent(this, key)
                                var batchable: Batchable = value as Batchable
                                batchable.pack(BatchType.update, batch)
                            }
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
                const properties = this.getProperties()
                for (var prop in properties) {
                    let key = properties[prop]
                    let descriptor = Object.getOwnPropertyDescriptor(this, key)
                    if (descriptor) {
                        let value = descriptor.value
                        if (isCollection(value)) {
                            var collection: SubCollection = value as SubCollection
                            collection.didSaved()
                        }
                    }
                }
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
        path: string
        reference: FirebaseFirestore.CollectionReference
        key: string
        setParent(parent: Base, key: string)
        didSaved()
    }

    function isCollection(arg): Boolean {
        return (arg instanceof ReferenceCollection) || (arg instanceof NestedCollection)
    }

    function isFile(arg): Boolean {
        return (arg instanceof File)
    }

    export class ReferenceCollection<T extends Base> implements SubCollection, Batchable {

        public path: string

        public reference: FirebaseFirestore.CollectionReference

        public parent: Base

        public key: string

        public objects: T[] = []

        private _count: number = 0

        constructor(parent: Base) {
            this.parent = parent
            parent._init()
        }

        isSaved(): Boolean {
            return this.parent.isSaved
        }

        setParent(parent: Base, key: string) {
            this.parent = parent
            this.key = key
            this.path = this.getPath()
            this.reference = this.getReference()
        }

        didSaved() {
            this._count = this.objects.length
            this.forEach((value) => {
                value.isSaved = true
            })
        }

        getPath(): string {
            return `${this.parent.path}/${this.key}`
        }

        getReference(): FirebaseFirestore.CollectionReference {
            return firestore.collection(this.getPath())
        }

        async insert(newMember: T) {
            if (this.isSaved()) {
                let reference = newMember.reference
                let parentRef = this.parent.reference
                let key = this.key
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
                    let key = this.key
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

        delete(member: T): Promise<Promise<FirebaseFirestore.WriteResult[] | null>> {
            if (this.isSaved()) {
                let reference = member.reference
                let parentRef = this.parent.reference
                let key = this.key
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

        async deleteAll() {
            this.parent._init()
            try {
                const snapshot: FirebaseFirestore.QuerySnapshot = await this.reference.get()
                const docs: FirebaseFirestore.DocumentSnapshot[] = snapshot.docs
                const batch: FirebaseFirestore.WriteBatch = firestore.batch()
                const key = this.key
                const parentRef = this.parent.reference
                await firestore.runTransaction((transaction) => {
                    return transaction.get(parentRef).then((document) => {
                        transaction.update(parentRef, { [key]: { "count": 0 } })
                    })
                })
                docs.forEach( doc => {
                    const reference = this.reference.doc(doc.id)                    
                    batch.delete(reference)
                })
                const result = await batch.commit()
                this.objects = []
                return result
            } catch(error) {
                throw error
            }
        }

        async get(type: { new(): T; }) {
            try {
                const snapshot: FirebaseFirestore.QuerySnapshot = await this.reference.get()
                const docs: FirebaseFirestore.DocumentSnapshot[] = snapshot.docs
                const documents: T[] = docs.map((snapshot) => {
                    let document: T = new type()
                    document.init(snapshot)
                    return document
                })
                this.objects = documents
                return documents
            } catch (error) {
                throw error
            }
        }

        contains(id: string): Promise<Boolean> {
            return new Promise<Boolean>((resolve, reject) => {
                this.reference.doc(id).get().then((snapshot) => {
                    resolve(snapshot.exists)
                }).catch((error) => {
                    reject(error)
                })
            })
        }

        forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any) {
            this.objects.forEach(callbackfn)
        }

        count(): number {
            return this.isSaved() ? this._count : this.objects.length
        }

        value(): any {
            return { "count": this.count() }
        }

        setValue(value: any, key: string) {
            this._count = value["count"] || 0
        }

        pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch {
            var batch = batch || firestore.batch()
            const self = this
            switch (type) {
                case BatchType.save:
                    this.forEach(document => {
                        let doc: T = document as T
                        let value = {
                            createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
                            updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                        }
                        let reference = self.reference.doc(document.id)
                        if (document.isSaved) {
                            document.pack(BatchType.update, batch).set(reference, value)
                        } else {
                            if (document.isLocalSaved) {
                                batch.set(reference, value)
                            } else {
                                document.isLocalSaved = true
                                document.pack(BatchType.save, batch).set(reference, value)
                            }
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
                            let reference = self.reference.doc(document.id)
                            document.pack(BatchType.update, batch).update(reference, value)
                        } else {
                            let value = {
                                createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
                                updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                            }
                            let reference = self.reference.doc(document.id)
                            if (document.isLocalSaved) {
                                batch.set(reference, value)
                            } else {
                                document.isLocalSaved = true
                                document.pack(BatchType.save, batch).set(reference, value)
                            }
                        }
                    })
                    return batch
                case BatchType.delete:
                    this.forEach(document => {
                        let reference = self.reference.doc(document.id)
                        batch.delete(reference)
                    })
                    return batch
            }
        }
    }

    export class NestedCollection<T extends Base> implements SubCollection, Batchable {

        public path: string

        public reference: FirebaseFirestore.CollectionReference

        public parent: Base

        public key: string

        public objects: T[] = []

        private _count: number = 0

        constructor(parent: Base) {
            this.parent = parent
            parent._init()
        }

        isSaved(): Boolean {
            return this.parent.isSaved
        }

        setParent(parent: Base, key: string) {
            this.parent = parent
            this.key = key
            this.path = this.getPath()
            this.reference = this.getReference()
        }

        didSaved() {
            this._count = this.objects.length
            this.forEach((value) => {
                value.isSaved = true
            })
        }

        getPath(): string {
            return `${this.parent.path}/${this.key}`
        }

        getReference(): FirebaseFirestore.CollectionReference {
            return firestore.collection(this.getPath())
        }

        async insert(newMember: T) {
            if (this.isSaved()) {
                let reference = this.reference.doc(newMember.id)
                let parentRef = this.parent.reference
                let key = this.key
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
                    let key = this.key
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
                            let reference = this.reference.doc(newMember.id)
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

        async delete(member: T) {
            if (this.isSaved()) {
                let reference = this.reference.doc(member.id)
                let parentRef = this.parent.reference
                let key = this.key
                var count = 0
                try {
                    const result = await firestore.runTransaction((transaction) => {
                        return transaction.get(parentRef).then((document) => {
                            const data = document.data()
                            const subCollection = data[key] || { "count": 0 }
                            const oldCount = subCollection["count"] || 0
                            count = oldCount - 1
                            transaction.update(parentRef, { [key]: { "count": count } })
                        })
                    })
                    this._count = count
                    var batch = firestore.batch()
                    return batch.delete(reference).commit()
                } catch (error) {
                    return error
                }
            } else {
                this.objects.some((v, i) => {
                    if (v.id == member.id) {
                        this.objects.splice(i, 1)
                        return true
                    }
                    return false
                })
            }
        }

        async deleteAll() {
            this.parent._init()
            try {
                const snapshot: FirebaseFirestore.QuerySnapshot = await this.reference.get()
                const docs: FirebaseFirestore.DocumentSnapshot[] = snapshot.docs
                const batch: FirebaseFirestore.WriteBatch = firestore.batch()
                const key = this.key
                const parentRef = this.parent.reference
                await firestore.runTransaction((transaction) => {
                    return transaction.get(parentRef).then((document) => {
                        transaction.update(parentRef, { [key]: { "count": 0 } })
                    })
                })
                docs.forEach( doc => {
                    const reference = this.reference.doc(doc.id)                    
                    batch.delete(reference)
                })
                const result = await batch.commit()
                this.objects = []
                return result
            } catch(error) {
                throw error
            }
        }

        async get(type: { new(): T; }) {
            try {
                const snapshot: FirebaseFirestore.QuerySnapshot = await this.reference.get()
                const docs: FirebaseFirestore.DocumentSnapshot[] = snapshot.docs
                const documents: T[] = docs.map((snapshot) => {
                    let document: T = new type()
                    document.init(snapshot)
                    return document
                })
                this.objects = documents
                return documents
            } catch (error) {
                throw error
            }
        }

        contains(id: string): Promise<Boolean> {
            return new Promise<Boolean>((resolve, reject) => {
                this.reference.doc(id).get().then((snapshot) => {
                    resolve(snapshot.exists)
                }).catch((error) => {
                    reject(error)
                })
            })
        }

        forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any) {
            this.objects.forEach(callbackfn)
        }

        count(): number {
            return this.isSaved() ? this._count : this.objects.length
        }

        value(): any {
            return { "count": this.count() }
        }

        setValue(value: any, key: string) {
            this._count = value["count"] || 0
        }

        pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch {
            var batch = batch || firestore.batch()
            const self = this
            switch (type) {
                case BatchType.save:
                    this.forEach(document => {
                        let doc: T = document as T
                        let reference = self.reference.doc(document.id)
                        batch.set(reference, document.value())
                    })
                    return batch
                case BatchType.update:
                    this.forEach(document => {
                        let doc: T = document as T
                        if (document.isSaved) {
                            let reference = self.reference.doc(document.id)
                            batch.update(reference, document.value())
                        } else {
                            let reference = self.reference.doc(document.id)
                            batch.set(reference, document.value())
                        }
                    })
                    return batch
                case BatchType.delete:
                    this.forEach(document => {
                        let reference = self.reference.doc(document.id)
                        batch.delete(reference)
                    })
                    return batch
            }
        }
    }

    export class File implements ValueProtocol {

        mimeType: string

        name: string

        url: string

        constructor(name?: string, url?: string, mimeType?: string) {
            this.name = name
            this.url = url
            this.mimeType = mimeType
        }

        init(value: object) {
            this.mimeType = value["mimeType"]
            this.name = value["name"]
            this.url = value["url"]
        }

        setValue(value: any, key: string) {
            this[key] = value
        }
        value(): any {
            return {
                "name": this.name || "",
                "url": this.url || "",
                "mimeType": this.mimeType || ""
            }
        }
    }

}