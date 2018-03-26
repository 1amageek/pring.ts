import * as FirebaseFirestore from '@google-cloud/firestore'
import { } from "reflect-metadata"
import { BatchType } from './batchable'
import { firestore } from './index'
import { Base, AnySubCollection, DocumentData } from './base'

export class SubCollection<T extends Base> implements AnySubCollection {

    public path: string

    public reference: FirebaseFirestore.CollectionReference

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

    getReference(): FirebaseFirestore.CollectionReference {
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

    async get(type: { new(id?: string, data?: DocumentData): T; }, id?: string) {
        if (id) {
            try {
                const snapshot: FirebaseFirestore.DocumentSnapshot = await this.reference.doc(id).get()
                if (snapshot.exists) {
                    const document: T = new type(snapshot.id, {})
                    document.setData(snapshot.data())
                    return document
                } else {
                    return undefined
                }
            } catch (error) {
                throw error
            }
        } else {
            try {
                const snapshot: FirebaseFirestore.QuerySnapshot = await this.reference.get()
                const docs: FirebaseFirestore.DocumentSnapshot[] = snapshot.docs
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
    }

    async contains(id: string) {
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

    pack(type: BatchType, batchID: string, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch {
        const _batch = batch || firestore.batch()
        const self = this
        switch (type) {
            case BatchType.save:
                this.forEach(document => {
                    const reference = self.reference.doc(document.id)
                    if (document.isSaved) {
                        _batch.create(reference, document.value())
                    } else {                        
                        _batch.set(reference, document.value())
                    }
                })
                return _batch
            case BatchType.update:
                const insertions = this._insertions.filter(item => this._deletions.indexOf(item) < 0)
                insertions.forEach(document => {
                    const reference = self.reference.doc(document.id)
                    _batch.set(reference, document.value())
                })
                const deletions = this._deletions.filter(item => this._insertions.indexOf(item) < 0)
                deletions.forEach(document => {
                    const reference = self.reference.doc(document.id)
                    _batch.delete(reference)
                })
                return _batch
            case BatchType.delete:
                this.forEach(document => {
                    const reference = self.reference.doc(document.id)
                    _batch.delete(reference)
                })
                return _batch
        }
    }

    batch(type: BatchType, batchID: string) {
        this.forEach(document => {
            document.batch(type, batchID)
        })
    }
}