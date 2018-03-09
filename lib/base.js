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
const functions = require("firebase-functions");
const UUID = require("uuid");
require("reflect-metadata");
const index_1 = require("./index");
const subCollection_1 = require("./subCollection");
const nestedCollection_1 = require("./nestedCollection");
const referenceCollection_1 = require("./referenceCollection");
const file_1 = require("./file");
const batchable_1 = require("./batchable");
const propertyMetadataKey = "property"; //Symbol("property")
exports.property = (target, propertyKey) => {
    const properties = Reflect.getMetadata(propertyMetadataKey, target) || [];
    properties.push(propertyKey);
    Reflect.defineMetadata(propertyMetadataKey, properties, target);
};
function isCollection(arg) {
    return (arg instanceof subCollection_1.SubCollection) ||
        (arg instanceof nestedCollection_1.NestedCollection) ||
        (arg instanceof referenceCollection_1.ReferenceCollection);
}
exports.isCollection = isCollection;
function isFile(arg) {
    return (arg instanceof file_1.File);
}
exports.isFile = isFile;
class Base {
    constructor(id) {
        this.isSaved = false;
        this.isLocalSaved = false;
        this.version = this.getVersion();
        this.modelName = this.getModelName();
        this.id = id || index_1.firestore.collection(`version/${this.version}/${this.modelName}`).doc().id;
        this.path = this.getPath();
        this.reference = this.getReference();
    }
    static getTriggerPath() {
        return `/version/{version}/${this.getModelName()}/{id}`;
    }
    static getTriggerDocument() {
        return functions.firestore.document(this.getTriggerPath());
    }
    // /** Respond to all document writes (creates, updates, or deletes). */
    // static onWrite(handler: (event: functions.Event<functions.firestore.DeltaDocumentSnapshot>) => PromiseLike<any> | any): functions.CloudFunction<functions.firestore.DeltaDocumentSnapshot> {
    //     return this.getTriggerDocument().onWrite(handler)
    // }
    // /** Respond only to document creations. */
    // static onCreate(handler: (event: functions.Event<functions.firestore.DeltaDocumentSnapshot>) => PromiseLike<any> | any): functions.CloudFunction<functions.firestore.DeltaDocumentSnapshot> {
    //     return this.getTriggerDocument().onCreate(handler)
    // }
    // /** Respond only to document updates. */
    // static onUpdate(handler: (event: functions.Event<functions.firestore.DeltaDocumentSnapshot>) => PromiseLike<any> | any): functions.CloudFunction<functions.firestore.DeltaDocumentSnapshot> {
    //     return this.getTriggerDocument().onUpdate(handler)
    // }
    // /** Respond only to document deletions. */
    // static onDelete(handler: (event: functions.Event<functions.firestore.DeltaDocumentSnapshot>) => PromiseLike<any> | any): functions.CloudFunction<functions.firestore.DeltaDocumentSnapshot> {
    //     return this.getTriggerDocument().onDelete(handler)
    // }
    static getReference() {
        return index_1.firestore.collection(this.getPath());
    }
    static getVersion() {
        return 1;
    }
    static getModelName() {
        return this.toString().split('(' || /s+/)[0].split(' ' || /s+/)[1].toLowerCase();
    }
    static getPath() {
        return `version/${this.getVersion()}/${this.getModelName()}`;
    }
    static self() {
        return new this();
    }
    static get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const snapshot = yield index_1.firestore.doc(`${this.getPath()}/${id}`).get();
                const document = new this();
                document.init(snapshot);
                return document;
            }
            catch (error) {
                throw error;
            }
        });
    }
    self() {
        return this;
    }
    _init() {
        const properties = this.getProperties();
        for (const prop in properties) {
            const key = properties[prop];
            const descriptor = Object.getOwnPropertyDescriptor(this, key);
            if (descriptor) {
                const value = descriptor.value;
                if (isCollection(value)) {
                    const collection = value;
                    collection.setParent(this, key);
                }
            }
        }
    }
    init(snapshot) {
        // ID
        const id = snapshot.id;
        Object.defineProperty(this, "id", {
            value: id,
            writable: true,
            enumerable: true,
            configurable: true
        });
        const properties = this.getProperties();
        const data = snapshot.data();
        if (data) {
            for (const key of properties) {
                const descriptor = Object.getOwnPropertyDescriptor(this, key);
                const value = data[key];
                if (descriptor) {
                    if (isCollection(descriptor.value)) {
                        const collection = descriptor.value;
                        collection.setParent(this, key);
                    }
                    else {
                        Object.defineProperty(this, key, {
                            value: value,
                            writable: true,
                            enumerable: true,
                            configurable: true
                        });
                    }
                }
                else {
                    if (value) {
                        Object.defineProperty(this, key, {
                            value: value,
                            writable: true,
                            enumerable: true,
                            configurable: true
                        });
                    }
                }
            }
        }
        // Properties
        this.path = this.getPath();
        this.reference = this.getReference();
        this.isSaved = true;
    }
    getVersion() {
        return 1;
    }
    getModelName() {
        return this.constructor.toString().split('(' || /s+/)[0].split(' ' || /s+/)[1].toLowerCase();
    }
    getPath() {
        return `version/${this.version}/${this.modelName}/${this.id}`;
    }
    getReference() {
        return index_1.firestore.doc(this.getPath());
    }
    getProperties() {
        return Reflect.getMetadata(propertyMetadataKey, this) || [];
    }
    setValue(value, key) {
        this[key] = value;
    }
    rawValue() {
        const properties = this.getProperties();
        const values = {};
        for (const prop in properties) {
            const key = properties[prop];
            const descriptor = Object.getOwnPropertyDescriptor(this, key);
            if (descriptor) {
                const value = descriptor.value;
                if (isCollection(value)) {
                    // Nothing 
                }
                else if (isFile(value)) {
                    const file = value;
                    values[key] = file.value();
                }
                else {
                    values[key] = value;
                }
            }
        }
        return values;
    }
    value() {
        const values = this.rawValue();
        if (this.isSaved) {
            values["updatedAt"] = FirebaseFirestore.FieldValue.serverTimestamp();
        }
        else {
            values["createdAt"] = FirebaseFirestore.FieldValue.serverTimestamp();
            values["updatedAt"] = FirebaseFirestore.FieldValue.serverTimestamp();
        }
        return values;
    }
    pack(type, batch) {
        const _batch = batch || index_1.firestore.batch();
        const reference = this.reference;
        const properties = this.getProperties();
        switch (type) {
            case batchable_1.BatchType.save:
                _batch.set(reference, this.value());
                for (const prop in properties) {
                    const key = properties[prop];
                    const descriptor = Object.getOwnPropertyDescriptor(this, key);
                    if (descriptor) {
                        const value = descriptor.value;
                        if (isCollection(value)) {
                            const collection = value;
                            collection.setParent(this, key);
                            const batchable = value;
                            batchable.pack(batchable_1.BatchType.save, _batch);
                        }
                    }
                }
                return _batch;
            case batchable_1.BatchType.update:
                _batch.update(reference, this.value());
                for (const prop in properties) {
                    const key = properties[prop];
                    const descriptor = Object.getOwnPropertyDescriptor(this, key);
                    if (descriptor) {
                        const value = descriptor.value;
                        if (isCollection(value)) {
                            const collection = value;
                            collection.setParent(this, key);
                            const batchable = value;
                            batchable.pack(batchable_1.BatchType.update, _batch);
                        }
                    }
                }
                return _batch;
            case batchable_1.BatchType.delete:
                _batch.delete(reference);
                return _batch;
        }
    }
    batch(type, batchID) {
        if (batchID === this.batchID) {
            return;
        }
        this.batchID = batchID;
        const properties = this.getProperties();
        this.isSaved = true;
        for (const prop in properties) {
            const key = properties[prop];
            const descriptor = Object.getOwnPropertyDescriptor(this, key);
            if (descriptor) {
                const value = descriptor.value;
                if (isCollection(value)) {
                    const collection = value;
                    collection.setParent(this, key);
                    collection.batch(type, batchID);
                }
            }
        }
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            this._init();
            const batch = this.pack(batchable_1.BatchType.save);
            try {
                const result = yield batch.commit();
                this.batch(batchable_1.BatchType.save, UUID.v4());
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            this._init();
            const batch = this.pack(batchable_1.BatchType.update);
            try {
                const result = yield batch.commit();
                this.batch(batchable_1.BatchType.update, UUID.v4());
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reference.delete();
        });
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const snapshot = yield this.reference.get();
                this.init(snapshot);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.Base = Base;
//# sourceMappingURL=base.js.map