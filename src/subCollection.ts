import { } from "reflect-metadata"
import * as firebase from 'firebase'
import { BatchType, Batch } from './batch'
import { firestore } from './index'
import {
    Base,
    AnySubCollection,
    CollectionReference,
    DocumentSnapshot,
    QuerySnapshot,
    WriteBatch,
    Transaction, 
    DocumentData
} from './base'

export class SubCollection<T extends Base> implements AnySubCollection {

    public path: string

    public reference: CollectionReference

    public parent: Base

    public key: string

    public batchID?: string

    public objects: T[] = []

    constructor(parent: Base) {
        this.parent = parent
    }

    protected _insertions: T[] = []

    protected _deletions: T[] = []

    isSaved(): Boolean {
        return this.parent.isSaved
    }

    setParent(parent: Base, key: string) {
        this.parent = parent
        this.key = key
        this.path = this.getPath()
        this.reference = this.getReference()
    }

    getPath(): string {
        return `${this.parent.path}/${this.key}`
    }

    getReference(): CollectionReference {
        return firestore.collection(this.getPath())
    }

    insert(newMember: T) {
        newMember.reference = this.reference.doc(newMember.id)
        this.objects.push(newMember)
        if (this.isSaved()) {
            this._insertions.push(newMember)
        }
    }

    delete(member: T) {
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

    async doc(id: string, type: { new(id?: string, data?: DocumentData): T; }, transaction?: Transaction) {
        try {
            let snapshot: DocumentSnapshot
            if (transaction) {
                snapshot = await transaction.get(this.reference.doc(id) as firebase.firestore.DocumentReference)
            } else {
                snapshot = await this.reference.doc(id).get()
            }             
            if (snapshot.exists) {
                const document: T = new type(snapshot.id, {})
                document.setData(snapshot.data())
                document.setParent(this)
                return document
            } else {
                return undefined
            }
        } catch (error) {
            throw error
        }     
    }

    async get(type: { new(id?: string, data?: DocumentData): T; }, transaction?: Transaction) {
        try {
            let snapshot: QuerySnapshot
            if (transaction) {
                if (transaction instanceof firebase.firestore.Transaction) {
                    console.log("[Pring] Firebase JS SDK Transaction not supported")
                }
            } else {
                snapshot = await this.reference.get()
            } 
            const docs: DocumentSnapshot[] = snapshot.docs
            const documents: T[] = docs.map((documentSnapshot) => {
                const document: T = new type(documentSnapshot.id, {})
                document.setData(documentSnapshot.data())
                return document
            })
            this.objects = documents
            return documents
        } catch (error) {
            throw error
        }       
    }

    async contains(id: string) {
        try {
            const snapshot = await this.reference.doc(id).get()
            return snapshot.exists
        } catch (error) {
            throw error
        }
    }

    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any) {
        this.objects.forEach(callbackfn)
    }

    pack(type: BatchType, batchID: string, writeBatch?: WriteBatch): WriteBatch {
        const _writeBatch: WriteBatch = writeBatch || firestore.batch()
        const _batch: Batch = new Batch(_writeBatch)
        const self = this
        switch (type) {
            case BatchType.save:
                this.forEach(document => {
                    const reference = self.reference.doc(document.id)
                    if (document.isSaved) {
                        _batch.set(reference, document.value())
                    } else {                        
                        _batch.set(reference, document.value(), { merge: true })
                    }
                })
                return _batch.batch()
            case BatchType.update:
                const insertions = this._insertions.filter(item => this._deletions.indexOf(item) < 0)
                insertions.forEach(document => {
                    const reference = self.reference.doc(document.id)
                    _batch.set(reference, document.value(), { merge: true})
                })
                const deletions = this._deletions.filter(item => this._insertions.indexOf(item) < 0)
                deletions.forEach(document => {
                    const reference = self.reference.doc(document.id)
                    _batch.delete(reference)
                })
                return _batch.batch()
            case BatchType.delete:
                this.forEach(document => {
                    const reference = self.reference.doc(document.id)
                    _batch.delete(reference)
                })
                return _batch.batch()
        }
    }

    batch(type: BatchType, batchID: string) {
        this.forEach(document => {
            document.batch(type, batchID)
        })
    }
}