"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UUID = require("uuid");
const FirebaseFirestore = require("@google-cloud/firestore");
const firebase = require("firebase");
require("reflect-metadata");
const index_1 = require("./index");
const subCollection_1 = require("./subCollection");
const nestedCollection_1 = require("./nestedCollection");
const referenceCollection_1 = require("./referenceCollection");
const file_1 = require("./file");
const batch_1 = require("./batch");
const DataSourceQuery = require("./query");
const propertyMetadataKey = Symbol("property");
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
function isTimestamp(arg) {
    return (arg instanceof firebase.firestore.Timestamp) || (arg instanceof FirebaseFirestore.Timestamp);
}
exports.isTimestamp = isTimestamp;
exports.isUndefined = (value) => {
    return (value === null || value === undefined);
};
/// Pring Base class
class Base {
    constructor(id, data) {
        this.isSaved = false;
        this.isLocalSaved = false;
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
            for (const prop of properties) {
                const key = prop;
                this._defineProperty(key, data[key]);
            }
            this.isSaved = true;
        }
        else {
            for (const prop of properties) {
                const key = prop;
                this._defineProperty(key);
            }
        }
    }
    static getTriggerPath() {
        return `/version/{version}/${this.getModelName()}/{id}`;
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
    static query() {
        return new DataSourceQuery.Query(this.getReference());
    }
    static async get(id) {
        try {
            const snapshot = await index_1.firestore.doc(`${this.getPath()}/${id}`).get();
            if (snapshot.exists) {
                const document = new this(snapshot.id, {});
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
    }
    setData(data) {
        if (data.createdAt) {
            this._defineProperty('createdAt', data.createdAt);
        }
        if (data.updatedAt) {
            this._defineProperty('updatedAt', data.updatedAt);
        }
        const properties = this.getProperties();
        for (const prop of properties) {
            const key = prop;
            const value = data[key];
            if (!exports.isUndefined(value)) {
                this._defineProperty(key, value);
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
                if (descriptor.get) {
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
        }
        return values;
    }
    value() {
        const values = this.rawValue();
        if (this.isSaved) {
            const updatedAt = "updatedAt";
            values[updatedAt] = index_1.timestamp;
        }
        else {
            const updatedAt = "updatedAt";
            const createdAt = "createdAt";
            values[updatedAt] = this.updatedAt || index_1.timestamp;
            values[createdAt] = this.createdAt || index_1.timestamp;
        }
        return values;
    }
    pack(type, batchID, writeBatch) {
        const _writeBatch = writeBatch || index_1.firestore.batch();
        const _batch = new batch_1.Batch(_writeBatch);
        // If a batch ID is not specified, it is generated
        const _batchID = batchID || UUID.v4();
        // If you do not process already packed documents
        if (_batchID === this.batchID) {
            return _batch.batch();
        }
        this.batchID = _batchID;
        const reference = this.reference;
        const properties = this.getProperties();
        switch (type) {
            case batch_1.BatchType.save:
                _batch.set(reference, this.value(), { merge: true });
                for (const key of properties) {
                    const descriptor = Object.getOwnPropertyDescriptor(this, key);
                    if (descriptor) {
                        if (descriptor.get) {
                            const value = descriptor.get();
                            if (isCollection(value)) {
                                const collection = value;
                                collection.setParent(this, key);
                                const batchable = value;
                                batchable.pack(batch_1.BatchType.save, _batchID, _writeBatch);
                            }
                        }
                    }
                }
                return _batch.batch();
            case batch_1.BatchType.update:
                const updateValues = this._updateValues;
                const updatedAt = "updatedAt";
                updateValues[updatedAt] = index_1.timestamp;
                _batch.update(reference, updateValues);
                for (const key of properties) {
                    const descriptor = Object.getOwnPropertyDescriptor(this, key);
                    if (descriptor) {
                        if (descriptor.get) {
                            const value = descriptor.get();
                            if (isCollection(value)) {
                                const collection = value;
                                collection.setParent(this, key);
                                const batchable = value;
                                batchable.pack(batch_1.BatchType.update, _batchID, _writeBatch);
                            }
                        }
                    }
                }
                return _batch.batch();
            case batch_1.BatchType.delete:
                _batch.delete(reference);
                return _batch.batch();
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
                if (descriptor.get) {
                    const value = descriptor.get();
                    if (value) {
                        if (isCollection(value)) {
                            const collection = value;
                            collection.setParent(this, key);
                            collection.batch(type, batchID);
                        }
                    }
                }
            }
        }
    }
    setParent(parent) {
        // Set reference
        this.path = `${parent.path}/${this.id}`;
        this.reference = index_1.firestore.doc(this.path);
    }
    async save() {
        const batch = this.pack(batch_1.BatchType.save);
        try {
            const result = await batch.commit();
            this.batch(batch_1.BatchType.save);
            this._updateValues = {};
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async update() {
        const batch = this.pack(batch_1.BatchType.update);
        try {
            const result = await batch.commit();
            this.batch(batch_1.BatchType.update);
            this._updateValues = {};
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async delete() {
        return await this.reference.delete();
    }
    async fetch(transaction) {
        try {
            let snapshot;
            if (transaction) {
                if (transaction instanceof firebase.firestore.Transaction) {
                    snapshot = await transaction.get(this.reference);
                }
                if (transaction instanceof FirebaseFirestore.Transaction) {
                    snapshot = await transaction.get(this.reference);
                }
            }
            else {
                snapshot = await this.reference.get();
            }
            const data = snapshot.data();
            if (data) {
                this.setData(data);
                this.isSaved = true;
            }
        }
        catch (error) {
            throw error;
        }
    }
    _defineProperty(key, value) {
        let _value = value;
        const descriptor = {
            enumerable: true,
            configurable: true,
            get: () => {
                if (isTimestamp(_value)) {
                    return _value.toDate();
                }
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
}
exports.Base = Base;
//# sourceMappingURL=base.js.map