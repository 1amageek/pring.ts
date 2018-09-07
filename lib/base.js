import * as tslib_1 from "tslib";
import * as UUID from 'uuid';
import * as firebase from 'firebase';
import "reflect-metadata";
import { firestore, timestamp } from './index';
import { SubCollection } from './subCollection';
import { NestedCollection } from './nestedCollection';
import { ReferenceCollection } from './referenceCollection';
import { File } from './file';
import { BatchType, Batch } from './batch';
import * as DataSourceQuery from './query';
const propertyMetadataKey = Symbol("property");
export const property = (target, propertyKey) => {
    const properties = Reflect.getMetadata(propertyMetadataKey, target) || [];
    properties.push(propertyKey);
    Reflect.defineMetadata(propertyMetadataKey, properties, target);
};
export function isCollection(arg) {
    return (arg instanceof SubCollection) ||
        (arg instanceof NestedCollection) ||
        (arg instanceof ReferenceCollection);
}
export function isFile(arg) {
    return (arg instanceof File);
}
export function isTimestamp(arg) {
    return (arg instanceof firebase.firestore.Timestamp);
}
export const isUndefined = (value) => {
    return (value === null || value === undefined);
};
/// Pring Base class
export class Base {
    constructor(id, data) {
        this.isSaved = false;
        this.isLocalSaved = false;
        this._updateValues = {};
        // set pring object base data
        this.version = this.getVersion();
        this.modelName = this.getModelName();
        // Set reference
        this.id = id || firestore.collection(`version/${this.version}/${this.modelName}`).doc().id;
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
        return firestore.collection(this.getPath());
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
    static get(id, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const snapshot = yield firestore.doc(`${this.getPath()}/${id}`).get();
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
            if (!isUndefined(value)) {
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
        return firestore.doc(this.getPath());
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
                    if (!isUndefined(value)) {
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
            values[updatedAt] = timestamp;
        }
        else {
            const updatedAt = "updatedAt";
            const createdAt = "createdAt";
            values[updatedAt] = this.updatedAt || timestamp;
            values[createdAt] = this.createdAt || timestamp;
        }
        return values;
    }
    pack(type, batchID, writeBatch) {
        const _writeBatch = writeBatch || firestore.batch();
        const _batch = new Batch(_writeBatch);
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
            case BatchType.save:
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
                                batchable.pack(BatchType.save, _batchID, _writeBatch);
                            }
                        }
                    }
                }
                return _batch.batch();
            case BatchType.update:
                const updateValues = this._updateValues;
                const updatedAt = "updatedAt";
                updateValues[updatedAt] = timestamp;
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
                                batchable.pack(BatchType.update, _batchID, _writeBatch);
                            }
                        }
                    }
                }
                return _batch.batch();
            case BatchType.delete:
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
        this.reference = firestore.doc(this.path);
    }
    save() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const batch = this.pack(BatchType.save);
            try {
                const result = yield batch.commit();
                this.batch(BatchType.save);
                this._updateValues = {};
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    update() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const batch = this.pack(BatchType.update);
            try {
                const result = yield batch.commit();
                this.batch(BatchType.update);
                this._updateValues = {};
                return result;
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.reference.delete();
        });
    }
    fetch(transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let snapshot;
                if (transaction) {
                    snapshot = yield transaction.get(this.reference);
                }
                else {
                    snapshot = yield this.reference.get();
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
        });
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
//# sourceMappingURL=base.js.map