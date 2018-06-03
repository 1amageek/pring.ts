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
class SubCollection {
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
        return index_1.firestore.collection(this.getPath());
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
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let snapshot;
                if (transaction) {
                    snapshot = yield transaction.get(this.reference.doc(id));
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
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let snapshot;
                if (transaction) {
                    snapshot = yield transaction.get(this.reference);
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
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.reference.doc(id).get().then((snapshot) => {
                    resolve(snapshot.exists);
                }).catch((error) => {
                    reject(error);
                });
            });
        });
    }
    forEach(callbackfn, thisArg) {
        this.objects.forEach(callbackfn);
    }
    pack(type, batchID, batch) {
        const _batch = batch || index_1.firestore.batch();
        const self = this;
        switch (type) {
            case batchable_1.BatchType.save:
                this.forEach(document => {
                    const reference = self.reference.doc(document.id);
                    if (document.isSaved) {
                        _batch.create(reference, document.value());
                    }
                    else {
                        _batch.set(reference, document.value(), { merge: true });
                    }
                });
                return _batch;
            case batchable_1.BatchType.update:
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
                return _batch;
            case batchable_1.BatchType.delete:
                this.forEach(document => {
                    const reference = self.reference.doc(document.id);
                    _batch.delete(reference);
                });
                return _batch;
        }
    }
    batch(type, batchID) {
        this.forEach(document => {
            document.batch(type, batchID);
        });
    }
}
exports.SubCollection = SubCollection;
//# sourceMappingURL=subCollection.js.map