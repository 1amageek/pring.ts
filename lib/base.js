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
const admin = require("firebase-admin");
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
exports.isUndefined = (value) => {
    return (value === null || value === undefined || value === NaN);
};
/// Pring Base class
class Base {
    constructor(id, data) {
        this.isSaved = false;
        this.isLocalSaved = false;
        // - basic 
        this._updateValues = {};
        // set pring object base data
        this.version = this.getVersion();
        this.modelName = this.getModelName();
        // Set reference
        this.id = id || index_1.firestore.collection(`version/${this.version}/${this.modelName}`).doc().id;
        this.path = this.getPath();
        this.reference = this.getReference();
        // Pring properties define 
        const properties = Reflect.getMetadata(propertyMetadataKey, this) || [];
        if (data) {
            for (const key of properties) {
                this._defineProperty(key, data[key]);
            }
            this.isSaved = true;
        }
        else {
            for (const key of properties) {
                this._defineProperty(key);
            }
        }
    }
    static getTriggerPath() {
        return `/version/{version}/${this.getModelName()}/{id}`;
    }
    static getTriggerDocument() {
        return functions.firestore.document(this.getTriggerPath());
    }
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
    static get(id, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const snapshot = yield index_1.firestore.doc(`${this.getPath()}/${id}`).get();
                if (snapshot.exists) {
                    const document = new type(snapshot.id, {});
                    document.setData(snapshot.data());
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
    _defineProperty(key, value) {
        let _value = value;
        const descriptor = {
            enumerable: true,
            configurable: true,
            get: () => {
                return _value;
            },
            set: (newValue) => {
                _value = newValue;
                if (isCollection(newValue)) {
                    const collection = newValue;
                    collection.setParent(this, key);
                }
                else if (isFile(newValue)) {
                    const file = newValue;
                    this._updateValues[key] = file.value();
                }
                else {
                    this._updateValues[key] = newValue;
                }
            }
        };
        Object.defineProperty(this, key, descriptor);
    }
    setData(data) {
        if (data.createdAt) {
            this._defineProperty('createdAt', data.createdAt);
        }
        if (data.updatedAt) {
            this._defineProperty('updatedAt', data.updatedAt);
        }
        const properties = this.getProperties();
        for (const key of properties) {
            const value = data[key];
            if (!exports.isUndefined(value)) {
                this._defineProperty(key, data[key]);
            }
        }
        this._updateValues = {};
    }
    shouldBeReplicated() {
        return false;
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
        for (const key of properties) {
            const descriptor = Object.getOwnPropertyDescriptor(this, key);
            if (descriptor) {
                const value = descriptor.get();
                if (!exports.isUndefined(value)) {
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
        }
        return values;
    }
    value() {
        const values = this.rawValue();
        if (this.isSaved) {
            values["updatedAt"] = admin.firestore.FieldValue.serverTimestamp();
        }
        else {
            values["createdAt"] = this.createdAt || admin.firestore.FieldValue.serverTimestamp();
            values["updatedAt"] = this.updatedAt || admin.firestore.FieldValue.serverTimestamp();
        }
        return values;
    }
    pack(type, batchID, batch) {
        const _batch = batch || index_1.firestore.batch();
        // If a batch ID is not specified, it is generated
        const _batchID = batchID || UUID.v4();
        // If you do not process already packed documents
        if (_batchID === this.batchID) {
            return _batch;
        }
        this.batchID = _batchID;
        const reference = this.reference;
        const properties = this.getProperties();
        switch (type) {
            case batchable_1.BatchType.save:
                _batch.set(reference, this.value());
                for (const key of properties) {
                    const descriptor = Object.getOwnPropertyDescriptor(this, key);
                    if (descriptor) {
                        const value = descriptor.get();
                        if (isCollection(value)) {
                            const collection = value;
                            collection.setParent(this, key);
                            const batchable = value;
                            batchable.pack(batchable_1.BatchType.save, _batchID, _batch);
                        }
                    }
                }
                return _batch;
            case batchable_1.BatchType.update:
                const updateValues = this._updateValues;
                updateValues["updatedAt"] = admin.firestore.FieldValue.serverTimestamp();
                _batch.update(reference, updateValues);
                for (const key of properties) {
                    const descriptor = Object.getOwnPropertyDescriptor(this, key);
                    if (descriptor) {
                        const value = descriptor.get();
                        if (isCollection(value)) {
                            const collection = value;
                            collection.setParent(this, key);
                            const batchable = value;
                            batchable.pack(batchable_1.BatchType.update, _batchID, _batch);
                        }
                    }
                }
                return _batch;
            case batchable_1.BatchType.delete:
                _batch.delete(reference);
                return _batch;
        }
    }
    batch(type, batchID = UUID.v4()) {
        if (batchID === this.batchID) {
            return;
        }
        this.batchID = batchID;
        const properties = this.getProperties();
        this.isSaved = true;
        for (const key of properties) {
            const descriptor = Object.getOwnPropertyDescriptor(this, key);
            if (descriptor) {
                const value = descriptor.get();
                if (isCollection(value)) {
                    const collection = value;
                    collection.setParent(this, key);
                    collection.batch(type, batchID);
                }
            }
        }
    }
    setParent(parent) {
        // Set reference
        this.path = `${parent.path}/${this.id}`;
        this.reference = index_1.firestore.doc(this.path);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const batch = this.pack(batchable_1.BatchType.save);
            try {
                const result = yield batch.commit();
                this.batch(batchable_1.BatchType.save);
                this._updateValues = {};
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const batch = this.pack(batchable_1.BatchType.update);
            try {
                const result = yield batch.commit();
                this.batch(batchable_1.BatchType.update);
                this._updateValues = {};
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
                const data = snapshot.data();
                if (data) {
                    this.setData(data);
                    this.isSaved = true;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.Base = Base;
//# sourceMappingURL=base.js.map