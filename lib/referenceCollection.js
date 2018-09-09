import * as tslib_1 from "tslib";
import { BatchType, Batch } from './batch';
import { firestore, timestamp } from './index';
import { SubCollection } from './subCollection';
export class ReferenceCollection extends SubCollection {
    nsert(newMember) {
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
    }
    pack(type, batchID, writeBatch) {
        const _writeBatch = writeBatch || firestore.batch();
        const _batch = new Batch(_writeBatch);
        switch (type) {
            case BatchType.save: {
                this.forEach(document => {
                    let value = {};
                    if (document.shouldBeReplicated()) {
                        value = document.value();
                    }
                    value.createdAt = timestamp;
                    value.updatedAt = timestamp;
                    if (!document.isSaved) {
                        _batch.set(document.getReference(), document.value(), { merge: true });
                    }
                    const reference = this.reference.doc(document.id);
                    _batch.set(reference, value, { merge: true });
                });
                return _batch.batch();
            }
            case BatchType.update:
                const insertions = this._insertions.filter(item => this._deletions.indexOf(item) < 0);
                insertions.forEach(document => {
                    let value = {};
                    if (document.isSaved) {
                        if (document.shouldBeReplicated()) {
                            value = document.value();
                        }
                        if (document.createdAt) {
                            value.createdAt = document.createdAt;
                        }
                        value.updatedAt = timestamp;
                        _batch.set(document.getReference(), document.value(), { merge: true });
                    }
                    else {
                        if (document.shouldBeReplicated()) {
                            value = document.value();
                        }
                        value.createdAt = timestamp;
                        value.updatedAt = timestamp;
                    }
                    const reference = this.reference.doc(document.id);
                    _batch.set(reference, value, { merge: true });
                });
                const deletions = this._deletions.filter(item => this._insertions.indexOf(item) < 0);
                deletions.forEach(document => {
                    const reference = this.reference.doc(document.id);
                    _batch.delete(reference);
                });
                return _batch.batch();
            case BatchType.delete:
                this.forEach(document => {
                    const reference = this.reference.doc(document.id);
                    _batch.delete(reference);
                });
                return _batch.batch();
        }
    }
    doc(id, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const document = new type(id, {});
                yield document.fetch();
                return document;
            }
            catch (error) {
                throw error;
            }
        });
    }
    get(type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const snapshot = yield this.reference.get();
                const docs = snapshot.docs;
                const documents = docs.map((documentSnapshot) => {
                    const document = new type(documentSnapshot.id, {});
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
}
//# sourceMappingURL=referenceCollection.js.map