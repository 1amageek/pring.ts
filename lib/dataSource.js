"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FirebaseFirestore = require("@google-cloud/firestore");
class Option {
    constructor() {
        this.timeout = 10;
    }
}
exports.Option = Option;
var Change;
(function (Change) {
    Change["initial"] = "initial";
    Change["update"] = "update";
    Change["error"] = "error";
})(Change = exports.Change || (exports.Change = {}));
class CollectionChange {
    constructor(type, insertions, modifications, deletions) {
        this.insertions = [];
        this.modifications = [];
        this.deletions = [];
        this.type = type;
        this.insertions = insertions;
        this.modifications = modifications;
        this.deletions = deletions;
    }
}
exports.CollectionChange = CollectionChange;
class DataSource {
    constructor(query, option = new Option(), type) {
        this.documents = [];
        this.query = query;
        this.option = option;
        this._Element = type;
    }
    doc(index) {
        return this.documents[index];
    }
    on(block) {
        this.changeBlock = block;
        return this;
    }
    onError(block) {
        this.errorBlock = block;
        return this;
    }
    onCompleted(block) {
        this.completedBlock = block;
        return this;
    }
    listen() {
        let isFirst = true;
        this.query.listen({
            next: async (snapshot) => {
                if (isFirst) {
                    await this._operate(snapshot, isFirst);
                    isFirst = false;
                }
                else {
                    await this._operate(snapshot, isFirst);
                }
            },
            error: (error) => {
                if (this.errorBlock) {
                    this.errorBlock(error);
                }
            },
            complete: () => {
                if (this.completedBlock) {
                    this.completedBlock(this.documents);
                }
            }
        });
        return this;
    }
    async get() {
        const snapshot = await this.query.get();
        const docs = snapshot.docs;
        const promises = docs.map(async (doc) => {
            return await this._get(doc.id, doc.data());
        });
        return Promise.all(promises);
    }
    async _operate(snapshot, isFirst) {
        let changes = [];
        if (snapshot instanceof FirebaseFirestore.QuerySnapshot) {
            changes = snapshot.docChanges;
        }
        else {
            changes = snapshot.docChanges();
        }
        changes.forEach(async (change) => {
            const id = change.doc.id;
            switch (change.type) {
                case 'added': {
                    const document = await this._get(change.doc.id, change.doc.data());
                    this.documents.push(document);
                    this.documents = this.documents.sort(this.option.sortBlock);
                    if (!isFirst) {
                        const IDs = this.documents.map(doc => doc.id);
                        if (IDs.includes(id)) {
                            const index = IDs.indexOf(id);
                            if (this.changeBlock) {
                                const collectionChange = new CollectionChange(Change.update, [index], [], []);
                                this.changeBlock(snapshot, collectionChange);
                            }
                        }
                    }
                    break;
                }
                case 'modified': {
                    const document = await this._get(change.doc.id, change.doc.data());
                    this.documents = this.documents.filter(doc => doc.id !== id);
                    this.documents.push(document);
                    this.documents = this.documents.sort(this.option.sortBlock);
                    const IDs = this.documents.map(doc => doc.id);
                    if (IDs.includes(id)) {
                        const index = IDs.indexOf(id);
                        if (this.changeBlock) {
                            const collectionChange = new CollectionChange(Change.update, [], [index], []);
                            this.changeBlock(snapshot, collectionChange);
                        }
                    }
                    break;
                }
                case 'removed': {
                    this.documents = this.documents.filter(doc => doc.id !== id);
                    this.documents = this.documents.sort(this.option.sortBlock);
                    const IDs = this.documents.map(doc => doc.id);
                    if (IDs.includes(id)) {
                        const index = IDs.indexOf(id);
                        if (this.changeBlock) {
                            const collectionChange = new CollectionChange(Change.update, [], [], [index]);
                            this.changeBlock(snapshot, collectionChange);
                        }
                    }
                    break;
                }
            }
        });
        if (isFirst) {
            if (this.changeBlock) {
                const collectionChange = new CollectionChange(Change.initial, [], [], []);
                this.changeBlock(snapshot, collectionChange);
            }
        }
    }
    async _get(id, data) {
        if (this.query.isReference) {
            const document = new this._Element(id, {});
            await document.fetch();
            return document;
        }
        else {
            const document = new this._Element(id, data);
            return document;
        }
    }
}
exports.DataSource = DataSource;
//# sourceMappingURL=dataSource.js.map