import { } from "reflect-metadata"
import * as firebase from 'firebase/app'
import { BatchType } from './batch'
import { firestore, timestamp } from './index'
import {
    Base,
    AnySubCollection,
    CollectionReference,
    DocumentSnapshot,
    QuerySnapshot,
    WriteBatch,
    Transaction
} from './base'
import * as DataSourceQuery from './query'

export class SubCollection<T extends Base> implements AnySubCollection {

    public path!: string

    public reference!: CollectionReference

    public parent: Base

    public key!: string

    public batchID?: string

    public objects: T[] = []

    protected _insertions: T[] = []

    protected _deletions: T[] = []

    public constructor(parent: Base) {
        this.parent = parent
    }

    public isSaved(): boolean {
        return this.parent.isSaved
    }

    public setParent(parent: Base, key: string) {
        this.parent = parent
        this.key = key
        this.path = this.getPath()
        this.reference = this.getReference()
    }

    public getPath(): string {
        return `${this.parent.path}/${this.key}`
    }

    public getReference(): CollectionReference {
        return firestore.collection(this.getPath())
    }

    public insert(newMember: T) {
        newMember.reference = this.reference.doc(newMember.id)
        this.objects.push(newMember)
        if (this.isSaved()) {
            this._insertions.push(newMember)
        }
    }

    public delete(member: T) {
        this.objects.some((v, i) => {
            if (v.id === member.id) {
                this.objects.splice(i, 1)
                return true
            }
            return false
        })
        if (this.isSaved()) {
            this._deletions.push(member)
        }
        member.reference = member.getReference()
    }

    public async doc(id: string, type: { new(...args: any[]): T }, transaction?: Transaction) {
        try {
            let snapshot: DocumentSnapshot
            if (transaction) {
                snapshot = await transaction.get(this.reference.doc(id))
            } else {
                snapshot = await this.reference.doc(id).get()
            }
            if (snapshot.exists) {
                const document = new type(snapshot.id, {})
                document.setData(snapshot.data()!)
                document.setParent(this)
                return document
            } else {
                return undefined
            }
        } catch (error) {
            throw error
        }
    }

    public async get(type: { new(...args: any[]): T }) {
        try {
            let snapshot: QuerySnapshot
            snapshot = await this.reference.get()
            const docs: DocumentSnapshot[] = snapshot.docs
            const documents: T[] = docs.map((documentSnapshot) => {
                const document = new type(documentSnapshot.id, documentSnapshot.data())
                return document
            })
            this.objects = documents
            return documents
        } catch (error) {
            throw error
        }
    }

    public async contains(id: string) {
        try {
            const snapshot = await this.reference.doc(id).get()
            return snapshot.exists
        } catch (error) {
            throw error
        }
    }

    public forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any) {
        this.objects.forEach(callbackfn)
    }

    public pack(type: BatchType, batchID: string, writeBatch?: WriteBatch): WriteBatch {
        const _writeBatch: WriteBatch = writeBatch || firestore.batch()
        const self = this
        switch (type) {
            case BatchType.save:
                this.forEach(document => {
                    const reference = self.reference.doc(document.id)
                    _writeBatch.set(reference, document.value(), { merge: true })
                })
                return _writeBatch
            case BatchType.update:
                const insertions = this._insertions.filter(item => this._deletions.indexOf(item) < 0)
                insertions.forEach(document => {
                    if (document.isSaved) {
                        const updateValue = document.updateValue()
                        if (Object.keys(updateValue).length) {
                            const reference = self.reference.doc(document.id)
                            updateValue.updatedAt = timestamp
                            _writeBatch.set(reference, updateValue, { merge: true })
                        }
                    } else {
                        const reference = self.reference.doc(document.id)
                        _writeBatch.set(reference, document.value(), { merge: true })
                    }
                })
                const deletions = this._deletions.filter(item => this._insertions.indexOf(item) < 0)
                deletions.forEach(document => {
                    const reference = self.reference.doc(document.id)
                    _writeBatch.delete(reference)
                })
                return _writeBatch
            case BatchType.delete:
                this.forEach(document => {
                    const reference = self.reference.doc(document.id)
                    _writeBatch.delete(reference)
                })
                return _writeBatch
        }
    }

    public query<T extends typeof Base>(type: T): DataSourceQuery.Query<T> {
        return new DataSourceQuery.Query(this.reference, type)
    }

    public batch(type: BatchType, batchID: string) {
        this.forEach(document => {
            document.batch(type, batchID)
        })
    }
}
