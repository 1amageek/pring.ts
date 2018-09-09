import * as tslib_1 from "tslib";
import * as FirebaseFirestore from '@google-cloud/firestore';
import * as firebase from 'firebase';
import { BatchType, Batch } from './batch';
import { firestore } from './index';
export class SubCollection {
    constructor(parent) {
        this.objects = [];
        this._insertions = [];
        this._deletions = [];
        this.parent = parent;
    }
    isSaved() {
        return this.parent.isSaved;
    }
    setParent(parent, key) {
        this.parent = parent;
        this.key = key;
        this.path = this.getPath();
        this.reference = this.getReference();
    }
    getPath() {
        return `${this.parent.path}/${this.key}`;
    }
    getReference() {
        return firestore.collection(this.getPath());
    }
    insert(newMember) {
        newMember.reference = this.reference.doc(newMember.id);
        this.objects.push(newMember);
        if (this.isSaved()) {
            this._insertions.push(newMember);
        }
    }
    delete(member) {
        this.objects.some((v, i) => {
            if (v.id === member.id) {
                this.objects.splice(i, 1);
                return true;
            }
            return false;
        });
        if (this.isSaved()) {
            this._deletions.push(member);
        }
        member.reference = member.getReference();
    }
    doc(id, type, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let snapshot;
                if (transaction) {
                    if (transaction instanceof firebase.firestore.Transaction) {
                        snapshot = yield transaction.get(this.reference.doc(id));
                    }
                    else {
                        snapshot = yield transaction.get(this.reference.doc(id));
                    }
                }
                else {
                    snapshot = yield this.reference.doc(id).get();
                }
                if (snapshot.exists) {
                    const document = new type(snapshot.id, {});
                    document.setData(snapshot.data());
                    document.setParent(this);
                    return document;
                }
                else {
                    return undefined;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    get(type, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let snapshot;
                if (transaction instanceof FirebaseFirestore.Transaction) {
                    const reference = this.reference;
                    snapshot = yield transaction.get(reference);
                }
                else {
                    snapshot = yield this.reference.get();
                }
                const docs = snapshot.docs;
                const documents = docs.map((documentSnapshot) => {
                    const document = new type(documentSnapshot.id, {});
                    document.setData(documentSnapshot.data());
                    return document;
                });
                this.objects = documents;
                return documents;
            }
            catch (error) {
                throw error;
            }
        });
    }
    contains(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const snapshot = yield this.reference.doc(id).get();
                return snapshot.exists;
            }
            catch (error) {
                throw error;
            }
        });
    }
    forEach(callbackfn, thisArg) {
        this.objects.forEach(callbackfn);
    }
    pack(type, batchID, writeBatch) {
        const _writeBatch = writeBatch || firestore.batch();
        const _batch = new Batch(_writeBatch);
        const self = this;
        switch (type) {
            case BatchType.save:
                this.forEach(document => {
                    const reference = self.reference.doc(document.id);
                    if (document.isSaved) {
                        _batch.set(reference, document.value());
                    }
                    else {
                        _batch.set(reference, document.value(), { merge: true });
                    }
                });
                return _batch.batch();
            case BatchType.update:
                const insertions = this._insertions.filter(item => this._deletions.indexOf(item) < 0);
                insertions.forEach(document => {
                    const reference = self.reference.doc(document.id);
                    _batch.set(reference, document.value(), { merge: true });
                });
                const deletions = this._deletions.filter(item => this._insertions.indexOf(item) < 0);
                deletions.forEach(document => {
                    const reference = self.reference.doc(document.id);
                    _batch.delete(reference);
                });
                return _batch.batch();
            case BatchType.delete:
                this.forEach(document => {
                    const reference = self.reference.doc(document.id);
                    _batch.delete(reference);
                });
                return _batch.batch();
        }
    }
    batch(type, batchID) {
        this.forEach(document => {
            document.batch(type, batchID);
        });
    }
}
//# sourceMappingURL=subCollection.js.map