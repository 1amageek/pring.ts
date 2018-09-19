var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as UUID from 'uuid';
import * as FirebaseFirestore from '@google-cloud/firestore';
import * as firebase from 'firebase';
import "reflect-metadata";
import { firestore, timestamp } from './index';
import { SubCollection } from './subCollection';
import { NestedCollection } from './nestedCollection';
import { ReferenceCollection } from './referenceCollection';
import { File } from './file';
import { BatchType, Batch } from './batch';
import * as DataSourceQuery from './query';
var propertyMetadataKey = Symbol("property");
export var property = function (target, propertyKey) {
    var properties = Reflect.getMetadata(propertyMetadataKey, target) || [];
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
    return (arg instanceof firebase.firestore.Timestamp) || (arg instanceof FirebaseFirestore.Timestamp);
}
export var isUndefined = function (value) {
    return (value === null || value === undefined);
};
/// Pring Base class
var Base = /** @class */ (function () {
    function Base(id, data) {
        this.isSaved = false;
        this.isLocalSaved = false;
        this._updateValues = {};
        // set pring object base data
        this.version = this.getVersion();
        this.modelName = this.getModelName();
        // Set reference
        this.id = id || firestore.collection("version/" + this.version + "/" + this.modelName).doc().id;
        this.path = this.getPath();
        this.reference = this.getReference();
        // Pring properties define
        var properties = Reflect.getMetadata(propertyMetadataKey, this) || [];
        if (data) {
            for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
                var prop = properties_1[_i];
                var key = prop;
                this._defineProperty(key, data[key]);
            }
            this.isSaved = true;
        }
        else {
            for (var _a = 0, properties_2 = properties; _a < properties_2.length; _a++) {
                var prop = properties_2[_a];
                var key = prop;
                this._defineProperty(key);
            }
        }
    }
    Base.getTriggerPath = function () {
        return "/version/{version}/" + this.getModelName() + "/{id}";
    };
    Base.getReference = function () {
        return firestore.collection(this.getPath());
    };
    Base.getVersion = function () {
        return 1;
    };
    Base.getModelName = function () {
        return this.toString().split('(' || /s+/)[0].split(' ' || /s+/)[1].toLowerCase();
    };
    Base.getPath = function () {
        return "version/" + this.getVersion() + "/" + this.getModelName();
    };
    Base.query = function () {
        return new DataSourceQuery.Query(this.getReference());
    };
    Base.get = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var snapshot, document_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, firestore.doc(this.getPath() + "/" + id).get()];
                    case 1:
                        snapshot = _a.sent();
                        if (snapshot.exists) {
                            document_1 = new this(snapshot.id, {});
                            document_1.setData(snapshot.data());
                            return [2 /*return*/, document_1];
                        }
                        else {
                            return [2 /*return*/, undefined];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Base.prototype.setData = function (data) {
        if (data.createdAt) {
            this._defineProperty('createdAt', data.createdAt);
        }
        if (data.updatedAt) {
            this._defineProperty('updatedAt', data.updatedAt);
        }
        var properties = this.getProperties();
        for (var _i = 0, properties_3 = properties; _i < properties_3.length; _i++) {
            var prop = properties_3[_i];
            var key = prop;
            var value = data[key];
            if (!isUndefined(value)) {
                this._defineProperty(key, value);
            }
        }
        this._updateValues = {};
    };
    Base.prototype.shouldBeReplicated = function () {
        return false;
    };
    Base.prototype.getVersion = function () {
        return 1;
    };
    Base.prototype.getModelName = function () {
        return this.constructor.toString().split('(' || /s+/)[0].split(' ' || /s+/)[1].toLowerCase();
    };
    Base.prototype.getPath = function () {
        return "version/" + this.version + "/" + this.modelName + "/" + this.id;
    };
    Base.prototype.getReference = function () {
        return firestore.doc(this.getPath());
    };
    Base.prototype.getProperties = function () {
        return Reflect.getMetadata(propertyMetadataKey, this) || [];
    };
    Base.prototype.setValue = function (value, key) {
        this[key] = value;
    };
    Base.prototype.rawValue = function () {
        var properties = this.getProperties();
        var values = {};
        for (var _i = 0, properties_4 = properties; _i < properties_4.length; _i++) {
            var key = properties_4[_i];
            var descriptor = Object.getOwnPropertyDescriptor(this, key);
            if (descriptor) {
                if (descriptor.get) {
                    var value = descriptor.get();
                    if (!isUndefined(value)) {
                        if (isCollection(value)) {
                            // Nothing
                        }
                        else if (isFile(value)) {
                            var file = value;
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
    };
    Base.prototype.value = function () {
        var values = this.rawValue();
        if (this.isSaved) {
            var updatedAt = "updatedAt";
            values[updatedAt] = timestamp;
        }
        else {
            var updatedAt = "updatedAt";
            var createdAt = "createdAt";
            values[updatedAt] = this.updatedAt || timestamp;
            values[createdAt] = this.createdAt || timestamp;
        }
        return values;
    };
    Base.prototype.pack = function (type, batchID, writeBatch) {
        var _writeBatch = writeBatch || firestore.batch();
        var _batch = new Batch(_writeBatch);
        // If a batch ID is not specified, it is generated
        var _batchID = batchID || UUID.v4();
        // If you do not process already packed documents
        if (_batchID === this.batchID) {
            return _batch.batch();
        }
        this.batchID = _batchID;
        var reference = this.reference;
        var properties = this.getProperties();
        switch (type) {
            case BatchType.save:
                _batch.set(reference, this.value(), { merge: true });
                for (var _i = 0, properties_5 = properties; _i < properties_5.length; _i++) {
                    var key = properties_5[_i];
                    var descriptor = Object.getOwnPropertyDescriptor(this, key);
                    if (descriptor) {
                        if (descriptor.get) {
                            var value = descriptor.get();
                            if (isCollection(value)) {
                                var collection = value;
                                collection.setParent(this, key);
                                var batchable = value;
                                batchable.pack(BatchType.save, _batchID, _writeBatch);
                            }
                        }
                    }
                }
                return _batch.batch();
            case BatchType.update:
                var updateValues = this._updateValues;
                var updatedAt = "updatedAt";
                updateValues[updatedAt] = timestamp;
                _batch.update(reference, updateValues);
                for (var _a = 0, properties_6 = properties; _a < properties_6.length; _a++) {
                    var key = properties_6[_a];
                    var descriptor = Object.getOwnPropertyDescriptor(this, key);
                    if (descriptor) {
                        if (descriptor.get) {
                            var value = descriptor.get();
                            if (isCollection(value)) {
                                var collection = value;
                                collection.setParent(this, key);
                                var batchable = value;
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
    };
    Base.prototype.batch = function (type, batchID) {
        if (batchID === void 0) { batchID = UUID.v4(); }
        if (batchID === this.batchID) {
            return;
        }
        this.batchID = batchID;
        var properties = this.getProperties();
        this.isSaved = true;
        for (var _i = 0, properties_7 = properties; _i < properties_7.length; _i++) {
            var key = properties_7[_i];
            var descriptor = Object.getOwnPropertyDescriptor(this, key);
            if (descriptor) {
                if (descriptor.get) {
                    var value = descriptor.get();
                    if (value) {
                        if (isCollection(value)) {
                            var collection = value;
                            collection.setParent(this, key);
                            collection.batch(type, batchID);
                        }
                    }
                }
            }
        }
    };
    Base.prototype.setParent = function (parent) {
        // Set reference
        this.path = parent.path + "/" + this.id;
        this.reference = firestore.doc(this.path);
    };
    Base.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var batch, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        batch = this.pack(BatchType.save);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, batch.commit()];
                    case 2:
                        result = _a.sent();
                        this.batch(BatchType.save);
                        this._updateValues = {};
                        return [2 /*return*/, result];
                    case 3:
                        error_2 = _a.sent();
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Base.prototype.update = function () {
        return __awaiter(this, void 0, void 0, function () {
            var batch, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        batch = this.pack(BatchType.update);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, batch.commit()];
                    case 2:
                        result = _a.sent();
                        this.batch(BatchType.update);
                        this._updateValues = {};
                        return [2 /*return*/, result];
                    case 3:
                        error_3 = _a.sent();
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Base.prototype.delete = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reference.delete()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Base.prototype.fetch = function (transaction) {
        return __awaiter(this, void 0, void 0, function () {
            var snapshot, data, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        snapshot = void 0;
                        if (!transaction) return [3 /*break*/, 5];
                        if (!(transaction instanceof firebase.firestore.Transaction)) return [3 /*break*/, 2];
                        return [4 /*yield*/, transaction.get(this.reference)];
                    case 1:
                        snapshot = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(transaction instanceof FirebaseFirestore.Transaction)) return [3 /*break*/, 4];
                        return [4 /*yield*/, transaction.get(this.reference)];
                    case 3:
                        snapshot = _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.reference.get()];
                    case 6:
                        snapshot = _a.sent();
                        _a.label = 7;
                    case 7:
                        data = snapshot.data();
                        if (data) {
                            this.setData(data);
                            this.isSaved = true;
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        error_4 = _a.sent();
                        throw error_4;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Base.prototype._defineProperty = function (key, value) {
        var _this = this;
        var _value = value;
        var descriptor = {
            enumerable: true,
            configurable: true,
            get: function () {
                if (isTimestamp(_value)) {
                    return _value.toDate();
                }
                return _value;
            },
            set: function (newValue) {
                _value = newValue;
                if (isCollection(newValue)) {
                    var collection = newValue;
                    collection.setParent(_this, key);
                }
                else if (isFile(newValue)) {
                    var file = newValue;
                    _this._updateValues[key] = file.value();
                }
                else {
                    _this._updateValues[key] = newValue;
                }
            }
        };
        Object.defineProperty(this, key, descriptor);
    };
    return Base;
}());
export { Base };
//# sourceMappingURL=base.js.map