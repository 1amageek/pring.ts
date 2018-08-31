"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const batch_1 = require("./batch");
const index_1 = require("./index");
const subCollection_1 = require("./subCollection");
class ReferenceCollection extends subCollection_1.SubCollection {
    insert(newMember) {
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
        const _writeBatch = writeBatch || index_1.firestore.batch();
        const _batch = new batch_1.Batch(_writeBatch);
        switch (type) {
            case batch_1.BatchType.save: {
                this.forEach(document => {
                    let value = {};
                    if (document.shouldBeReplicated()) {
                        value = document.value();
                    }
                    value["createdAt"] = index_1.timestamp;
                    value["updatedAt"] = index_1.timestamp;
                    if (!document.isSaved) {
                        _batch.set(document.reference, document.value(), { merge: true });
                    }
                    const reference = this.reference.doc(document.id);
                    _batch.set(reference, value, { merge: true });
                });
                return _batch.batch();
            }
            case batch_1.BatchType.update:
                const insertions = this._insertions.filter(item => this._deletions.indexOf(item) < 0);
                insertions.forEach(document => {
                    let value = {};
                    if (document.isSaved) {
                        if (document.shouldBeReplicated()) {
                            value = document.value();
                        }
                        if (document.createdAt) {
                            value["createdAt"] = document.createdAt;
                        }
                        value["updatedAt"] = index_1.timestamp;
                        _batch.set(document.reference, document.value(), { merge: true });
                    }
                    else {
                        if (document.shouldBeReplicated()) {
                            value = document.value();
                        }
                        value["createdAt"] = index_1.timestamp;
                        value["updatedAt"] = index_1.timestamp;
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
            case batch_1.BatchType.delete:
                this.forEach(document => {
                    const reference = this.reference.doc(document.id);
                    _batch.delete(reference);
                });
                return _batch.batch();
        }
    }
    async doc(id, type) {
        try {
            const document = new type(id, {});
            await document.fetch();
            return document;
        }
        catch (error) {
            throw error;
        }
    }
    async get(type) {
        try {
            const snapshot = await this.reference.get();
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
    }
}
exports.ReferenceCollection = ReferenceCollection;
//# sourceMappingURL=referenceCollection.js.map