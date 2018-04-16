"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const batchable_1 = require("./batchable");
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
    pack(type, batchID, batch) {
        const _batch = batch || index_1.firestore.batch();
        switch (type) {
            case batchable_1.BatchType.save: {
                this.forEach(document => {
                    let value = {};
                    if (document.shouldBeReplicated()) {
                        value = document.value();
                    }
                    value["createdAt"] = index_1.timestamp;
                    value["updatedAt"] = index_1.timestamp;
                    if (!document.isSaved) {
                        _batch.set(document.reference, document.value());
                    }
                    const reference = this.reference.doc(document.id);
                    _batch.set(reference, value);
                });
                return _batch;
            }
            case batchable_1.BatchType.update:
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
                        _batch.set(document.reference, document.value());
                    }
                    else {
                        if (document.shouldBeReplicated()) {
                            value = document.value();
                        }
                        value["createdAt"] = index_1.timestamp;
                        value["updatedAt"] = index_1.timestamp;
                    }
                    const reference = this.reference.doc(document.id);
                    _batch.set(reference, value);
                });
                const deletions = this._deletions.filter(item => this._insertions.indexOf(item) < 0);
                deletions.forEach(document => {
                    const reference = this.reference.doc(document.id);
                    _batch.delete(reference);
                });
                return _batch;
            case batchable_1.BatchType.delete:
                this.forEach(document => {
                    const reference = this.reference.doc(document.id);
                    _batch.delete(reference);
                });
                return _batch;
        }
    }
    doc(id, type) {
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
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
exports.ReferenceCollection = ReferenceCollection;
//# sourceMappingURL=referenceCollection.js.map