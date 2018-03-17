import * as FirebaseFirestore from '@google-cloud/firestore'
import { } from "reflect-metadata"
import { BatchType } from './batchable'
import { firestore } from './index'
import { Base } from './base'
import { SubCollection } from './subCollection'

export class ReferenceCollection<T extends Base> extends SubCollection<T> {

    insert(newMember: T) {
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
    }

    pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch {
        const _batch = batch || firestore.batch()
        const self = this
        switch (type) {
            case BatchType.save: {
                this.forEach(document => {
                    let value = {}
                    if (document.shouldBeReplicated()) {
                        value = document.value()
                    }
                    value["createdAt"] = FirebaseFirestore.FieldValue.serverTimestamp()
                    value["updatedAt"] = FirebaseFirestore.FieldValue.serverTimestamp()
                    if (!document.isSaved) {
                        _batch.set(document.reference, document.value())
                    }
                    const reference = self.reference.doc(document.id)
                    _batch.set(reference, value)
                })
                return _batch
            }
            case BatchType.update:
                const insertions = this._insertions.filter(item => this._deletions.indexOf(item) < 0)
                insertions.forEach(document => {
                    let value = {}
                    if (document.isSaved) {
                        if (document.shouldBeReplicated()) {
                            value = document.value()
                        }
                        value["createdAt"] = document.createdAt
                        value["updatedAt"] = FirebaseFirestore.FieldValue.serverTimestamp()
                        _batch.set(document.reference, document.value())
                    } else {
                        if (document.shouldBeReplicated()) {
                            value = document.value()
                        }
                        value["createdAt"] = FirebaseFirestore.FieldValue.serverTimestamp()
                        value["updatedAt"] = FirebaseFirestore.FieldValue.serverTimestamp()
                    }
                    const reference = self.reference.doc(document.id)
                    _batch.set(reference, value)
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

    async get(type: { new(id?: string, value?: { [key: string]: any }): T; }) {
        try {
            const snapshot: FirebaseFirestore.QuerySnapshot = await this.reference.get()
            const docs: FirebaseFirestore.DocumentSnapshot[] = snapshot.docs
            const documents: T[] = docs.map((documentSnapshot) => {
                const document: T = new type(documentSnapshot.id, {})
                return document
            })
            this.objects = documents
            return documents
        } catch (error) {
            throw error
        }
    }
}