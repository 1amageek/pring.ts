import { } from 'reflect-metadata'
import { BatchType } from './batch'
import { firestore } from './index'
import { SubCollection } from './subCollection'
import * as firebase from 'firebase/app'
import * as DataSourceQuery from './query'
import {
    Base,
    DocumentSnapshot,
    QuerySnapshot,
    WriteBatch
} from './base'

export class ReferenceCollection<T extends Base> extends SubCollection<T> {

    public doc(id: string, type: { new(...args: any[]): T }) {
        const document = new type(id)
        return document
    }

    public insert(newMember: T) {
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
    }

    public pack(type: BatchType, batchID?: string, writeBatch?: WriteBatch): WriteBatch {
        const _writeBatch: WriteBatch = writeBatch || firestore.batch()
        switch (type) {
            case BatchType.save: {
                this.forEach(document => {
                    if (document.shouldBeReplicated()) {
                        const reference = this.reference.doc(document.id)
                        const value = document.value()
                        value["createdAt"] = firebase.firestore.FieldValue.serverTimestamp()
                        value["updatedAt"] = firebase.firestore.FieldValue.serverTimestamp()
                        _writeBatch.set(reference, value, { merge: true })
                    } else {
                        const reference = this.reference.doc(document.id)
                        const value = {
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        }
                        _writeBatch.set(reference, value, { merge: true })
                    }
                    document.pack(BatchType.save, batchID, _writeBatch)
                })
                return _writeBatch
            }
            case BatchType.update:
                const insertions = this._insertions.filter(item => this._deletions.indexOf(item) < 0)
                insertions.forEach(document => {
                    if (document.shouldBeReplicated()) {
                        const reference = this.reference.doc(document.id)
                        const value = document.value()
                        if (document.isSaved) {
                            value["updatedAt"] = firebase.firestore.FieldValue.serverTimestamp()
                        } else {
                            value["createdAt"] = firebase.firestore.FieldValue.serverTimestamp()
                            value["updatedAt"] = firebase.firestore.FieldValue.serverTimestamp()
                        }
                        _writeBatch.set(reference, value, { merge: true })
                    } else {
                        const reference = this.reference.doc(document.id)
                        if (document.isSaved) {
                            const value = {
                                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                            }
                            _writeBatch.set(reference, value, { merge: true })
                        } else {
                            const value = {
                                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                            }
                            _writeBatch.set(reference, value, { merge: true })
                        }
                    }
                    document.pack(BatchType.update, batchID, _writeBatch)
                })
                const deletions = this._deletions.filter(item => this._insertions.indexOf(item) < 0)
                deletions.forEach(document => {
                    _writeBatch.delete(document.reference)
                })
                return _writeBatch
            case BatchType.delete:
                this.forEach(document => {
                    _writeBatch.delete(document.reference)
                })
                return _writeBatch
        }
    }

    public async get(type: { new(...args: any[]): T }) {
        try {
            const snapshot: QuerySnapshot = await this.reference.get()
            const docs: DocumentSnapshot[] = snapshot.docs
            const documents: T[] = docs.map((documentSnapshot) => {
                const document: T = new type(documentSnapshot.id, {})
                document.setParent(this)
                return document
            })
            this.objects = documents
            return documents
        } catch (error) {
            throw error
        }
    }

    public query<T extends typeof Base>(type: T): DataSourceQuery.Query<T> {
        const query = new DataSourceQuery.Query(this.reference, this.reference, type)
        query.isReference = true
        return query
    }
}
