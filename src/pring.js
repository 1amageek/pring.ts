"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
exports.__esModule = true;
var FirebaseFirestore = require("@google-cloud/firestore");
var UUID = require("uuid");
require("reflect-metadata");
var propertyMetadataKey = "property"; //Symbol("property")
exports.property = function (target, propertyKey) {
    var properties = Reflect.getMetadata(propertyMetadataKey, target) || [];
    properties.push(propertyKey);
    Reflect.defineMetadata(propertyMetadataKey, properties, target);
};
var firestore;
var Pring;
(function (Pring) {
    function initialize(options) {
        firestore = new FirebaseFirestore.Firestore(options);
    }
    Pring.initialize = initialize;
    var BatchType;
    (function (BatchType) {
        BatchType[BatchType["save"] = 0] = "save";
        BatchType[BatchType["update"] = 1] = "update";
        BatchType[BatchType["delete"] = 2] = "delete";
    })(BatchType = Pring.BatchType || (Pring.BatchType = {}));
    var Base = /** @class */ (function () {
        function Base(id) {
            this.isSaved = false;
            this.isLocalSaved = false;
            this.version = this.getVersion();
            this.modelName = this.getModelName();
            this.id = id || firestore.collection("version/" + this.version + "/" + this.modelName).doc().id;
            this.path = this.getPath();
            this.reference = this.getReference();
        }
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
        Base.self = function () {
            return new this();
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
                            document_1 = new this();
                            document_1.init(snapshot);
                            return [2 /*return*/, document_1];
                        case 2:
                            error_1 = _a.sent();
                            throw error_1;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        Base.prototype.self = function () {
            return this;
        };
        Base.prototype._init = function () {
            var properties = this.getProperties();
            for (var prop in properties) {
                var key = properties[prop];
                var descriptor = Object.getOwnPropertyDescriptor(this, key);
                if (descriptor) {
                    var value = descriptor.value;
                    if (isCollection(value)) {
                        var collection = value;
                        collection.setParent(this, key);
                    }
                }
            }
        };
        Base.prototype.init = function (snapshot) {
            // ID
            var id = snapshot.id;
            Object.defineProperty(this, "id", {
                value: id,
                writable: true,
                enumerable: true,
                configurable: true
            });
            var properties = this.getProperties();
            var data = snapshot.data();
            if (data) {
                for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
                    var key = properties_1[_i];
                    var descriptor = Object.getOwnPropertyDescriptor(this, key);
                    var value = data[key];
                    if (descriptor) {
                        if (isCollection(descriptor.value)) {
                            var collection = descriptor.value;
                            collection.setParent(this, key);
                            if (isValuable(collection)) {
                                var v = descriptor.value;
                                v.setValue(value, key);
                            }
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
            return Reflect.getMetadata(propertyMetadataKey, this);
        };
        Base.prototype.setValue = function (value, key) {
        };
        Base.prototype.rawValue = function () {
            var properties = this.getProperties();
            var values = {};
            for (var prop in properties) {
                var key = properties[prop];
                var descriptor = Object.getOwnPropertyDescriptor(this, key);
                if (descriptor) {
                    var value = descriptor.value;
                    if (isCollection(value)) {
                        if (isValuable(value)) {
                            var collection = value;
                            values[key] = collection.value();
                        }
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
            return values;
        };
        Base.prototype.value = function () {
            var values = this.rawValue();
            if (this.isSaved) {
                values["updatedAt"] = FirebaseFirestore.FieldValue.serverTimestamp();
            }
            else {
                values["createdAt"] = FirebaseFirestore.FieldValue.serverTimestamp();
                values["updatedAt"] = FirebaseFirestore.FieldValue.serverTimestamp();
            }
            return values;
        };
        Base.prototype.pack = function (type, batch) {
            var batch = batch || firestore.batch();
            var reference = this.reference;
            var properties = this.getProperties();
            switch (type) {
                case BatchType.save:
                    batch.set(reference, this.value());
                    for (var prop in properties) {
                        var key = properties[prop];
                        var descriptor = Object.getOwnPropertyDescriptor(this, key);
                        if (descriptor) {
                            var value = descriptor.value;
                            if (isCollection(value)) {
                                var collection = value;
                                collection.setParent(this, key);
                                var batchable = value;
                                batchable.pack(BatchType.save, batch);
                            }
                        }
                    }
                    return batch;
                case BatchType.update:
                    batch.update(reference, this.value());
                    for (var prop in properties) {
                        var key = properties[prop];
                        var descriptor = Object.getOwnPropertyDescriptor(this, key);
                        if (descriptor) {
                            var value = descriptor.value;
                            if (isCollection(value)) {
                                var collection = value;
                                collection.setParent(this, key);
                                var batchable = value;
                                batchable.pack(BatchType.update, batch);
                            }
                        }
                    }
                    return batch;
                case BatchType["delete"]:
                    batch["delete"](reference);
                    return batch;
            }
        };
        Base.prototype.batch = function (type, batchID) {
            if (batchID == this.batchID) {
                return;
            }
            this.batchID = batchID;
            var properties = this.getProperties();
            this.isSaved = true;
            for (var prop in properties) {
                var key = properties[prop];
                var descriptor = Object.getOwnPropertyDescriptor(this, key);
                if (descriptor) {
                    var value = descriptor.value;
                    if (isCollection(value)) {
                        var collection = value;
                        collection.setParent(this, key);
                        collection.batch(type, batchID);
                    }
                }
            }
        };
        Base.prototype.save = function () {
            return __awaiter(this, void 0, void 0, function () {
                var batch, result, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this._init();
                            batch = this.pack(BatchType.save);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, batch.commit()];
                        case 2:
                            result = _a.sent();
                            this.batch(BatchType.save, UUID.v4());
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
                            this._init();
                            batch = this.pack(BatchType.update);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, batch.commit()];
                        case 2:
                            result = _a.sent();
                            this.batch(BatchType.update, UUID.v4());
                            return [2 /*return*/, result];
                        case 3:
                            error_3 = _a.sent();
                            throw error_3;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        Base.prototype["delete"] = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reference["delete"]()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        Base.prototype.fetch = function () {
            return __awaiter(this, void 0, void 0, function () {
                var snapshot, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.reference.get()];
                        case 1:
                            snapshot = _a.sent();
                            this.init(snapshot);
                            return [3 /*break*/, 3];
                        case 2:
                            error_4 = _a.sent();
                            throw error_4;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return Base;
    }());
    Pring.Base = Base;
    function isCollection(arg) {
        return (arg instanceof SubCollection) ||
            (arg instanceof NestedCollection) ||
            (arg instanceof ReferenceCollection) ||
            (arg instanceof CountableNestedCollection) ||
            (arg instanceof CountableReferenceCollection);
    }
    function isValuable(arg) {
        return (arg instanceof CountableNestedCollection) ||
            (arg instanceof CountableReferenceCollection);
    }
    function isFile(arg) {
        return (arg instanceof File);
    }
    var SubCollection = /** @class */ (function () {
        function SubCollection(parent) {
            this.objects = [];
            this._insertions = [];
            this._deletions = [];
            this.parent = parent;
            parent._init();
        }
        SubCollection.prototype.isSaved = function () {
            return this.parent.isSaved;
        };
        SubCollection.prototype.setParent = function (parent, key) {
            this.parent = parent;
            this.key = key;
            this.path = this.getPath();
            this.reference = this.getReference();
        };
        SubCollection.prototype.getPath = function () {
            return this.parent.path + "/" + this.key;
        };
        SubCollection.prototype.getReference = function () {
            return firestore.collection(this.getPath());
        };
        SubCollection.prototype.insert = function (newMember) {
            this.parent._init();
            newMember.reference = this.reference.doc(newMember.id);
            this.objects.push(newMember);
            if (this.isSaved()) {
                this._insertions.push(newMember);
            }
        };
        SubCollection.prototype["delete"] = function (member) {
            var _this = this;
            this.parent._init();
            this.objects.some(function (v, i) {
                if (v.id == member.id) {
                    _this.objects.splice(i, 1);
                    return true;
                }
                return false;
            });
            if (this.isSaved()) {
                this._deletions.push(member);
            }
            member.reference = member.getReference();
        };
        SubCollection.prototype.get = function (type) {
            return __awaiter(this, void 0, void 0, function () {
                var snapshot, docs, documents, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.parent._init();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.reference.get()];
                        case 2:
                            snapshot = _a.sent();
                            docs = snapshot.docs;
                            documents = docs.map(function (snapshot) {
                                var document = new type();
                                document.init(snapshot);
                                return document;
                            });
                            this.objects = documents;
                            return [2 /*return*/, documents];
                        case 3:
                            error_5 = _a.sent();
                            throw error_5;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        SubCollection.prototype.contains = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    this.parent._init();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            _this.reference.doc(id).get().then(function (snapshot) {
                                resolve(snapshot.exists);
                            })["catch"](function (error) {
                                reject(error);
                            });
                        })];
                });
            });
        };
        SubCollection.prototype.forEach = function (callbackfn, thisArg) {
            this.parent._init();
            this.objects.forEach(callbackfn);
        };
        SubCollection.prototype.pack = function (type, batch) {
            var _this = this;
            var batch = batch || firestore.batch();
            var self = this;
            switch (type) {
                case BatchType.save:
                    this.forEach(function (document) {
                        var doc = document;
                        var reference = self.reference.doc(document.id);
                        batch.set(reference, document.value());
                    });
                    return batch;
                case BatchType.update:
                    var insertions = this._insertions.filter(function (item) { return _this._deletions.indexOf(item) < 0; });
                    insertions.forEach(function (document) {
                        var reference = self.reference.doc(document.id);
                        batch.set(reference, document.value());
                    });
                    var deletions = this._deletions.filter(function (item) { return _this._insertions.indexOf(item) < 0; });
                    deletions.forEach(function (document) {
                        var reference = self.reference.doc(document.id);
                        batch["delete"](reference);
                    });
                    return batch;
                case BatchType["delete"]:
                    this.forEach(function (document) {
                        var reference = self.reference.doc(document.id);
                        batch["delete"](reference);
                    });
                    return batch;
            }
        };
        SubCollection.prototype.batch = function (type, batchID) {
            this.forEach(function (document) {
                document.batch(type, batchID);
            });
        };
        return SubCollection;
    }());
    Pring.SubCollection = SubCollection;
    var NestedCollection = /** @class */ (function (_super) {
        __extends(NestedCollection, _super);
        function NestedCollection() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return NestedCollection;
    }(SubCollection));
    Pring.NestedCollection = NestedCollection;
    var ReferenceCollection = /** @class */ (function (_super) {
        __extends(ReferenceCollection, _super);
        function ReferenceCollection() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ReferenceCollection.prototype.insert = function (newMember) {
            this.parent._init();
            this.objects.push(newMember);
            if (this.isSaved()) {
                this._insertions.push(newMember);
            }
        };
        ReferenceCollection.prototype["delete"] = function (member) {
            var _this = this;
            this.parent._init();
            this.objects.some(function (v, i) {
                if (v.id == member.id) {
                    _this.objects.splice(i, 1);
                    return true;
                }
                return false;
            });
            if (this.isSaved()) {
                this._deletions.push(member);
            }
        };
        ReferenceCollection.prototype.pack = function (type, batch) {
            var _this = this;
            var batch = batch || firestore.batch();
            var self = this;
            switch (type) {
                case BatchType.save:
                    var value = {
                        createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
                        updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                    };
                    this.forEach(function (document) {
                        if (!document.isSaved) {
                            batch.set(document.reference, document.value());
                        }
                        var reference = self.reference.doc(document.id);
                        batch.set(reference, value);
                    });
                    return batch;
                case BatchType.update:
                    var insertions = this._insertions.filter(function (item) { return _this._deletions.indexOf(item) < 0; });
                    insertions.forEach(function (document) {
                        var value = {
                            updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                        };
                        if (!document.isSaved) {
                            value["createdAt"] = FirebaseFirestore.FieldValue.serverTimestamp();
                            batch.set(document.reference, document.value());
                        }
                        var reference = self.reference.doc(document.id);
                        batch.set(reference, value);
                    });
                    var deletions = this._deletions.filter(function (item) { return _this._insertions.indexOf(item) < 0; });
                    deletions.forEach(function (document) {
                        var reference = self.reference.doc(document.id);
                        batch["delete"](reference);
                    });
                    return batch;
                case BatchType["delete"]:
                    this.forEach(function (document) {
                        var reference = self.reference.doc(document.id);
                        batch["delete"](reference);
                    });
                    return batch;
            }
        };
        ReferenceCollection.prototype.get = function (type) {
            return __awaiter(this, void 0, void 0, function () {
                var snapshot, docs, documents, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.parent._init();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.reference.get()];
                        case 2:
                            snapshot = _a.sent();
                            docs = snapshot.docs;
                            documents = docs.map(function (snapshot) {
                                var document = new type(snapshot.id);
                                return document;
                            });
                            this.objects = documents;
                            return [2 /*return*/, documents];
                        case 3:
                            error_6 = _a.sent();
                            throw error_6;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return ReferenceCollection;
    }(SubCollection));
    Pring.ReferenceCollection = ReferenceCollection;
    var CountableReferenceCollection = /** @class */ (function () {
        function CountableReferenceCollection(parent) {
            this.objects = [];
            this._count = 0;
            this.parent = parent;
            parent._init();
        }
        CountableReferenceCollection.prototype.isSaved = function () {
            return this.parent.isSaved;
        };
        CountableReferenceCollection.prototype.setParent = function (parent, key) {
            this.parent = parent;
            this.key = key;
            this.path = this.getPath();
            this.reference = this.getReference();
        };
        CountableReferenceCollection.prototype.getPath = function () {
            return this.parent.path + "/" + this.key;
        };
        CountableReferenceCollection.prototype.getReference = function () {
            return firestore.collection(this.getPath());
        };
        CountableReferenceCollection.prototype.insert = function (newMember) {
            return __awaiter(this, void 0, void 0, function () {
                var reference, parentRef_1, key_1, count, batch, collectionReference, value, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.parent._init();
                            if (!this.isSaved()) return [3 /*break*/, 5];
                            reference = newMember.reference;
                            parentRef_1 = this.parent.reference;
                            key_1 = this.key;
                            count = 0;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, firestore.runTransaction(function (transaction) {
                                    return transaction.get(parentRef_1).then(function (document) {
                                        var data = document.data();
                                        var subCollection = data[key_1] || { "count": 0 };
                                        var oldCount = subCollection["count"] || 0;
                                        count = oldCount + 1;
                                        transaction.update(parentRef_1, (_a = {}, _a[key_1] = { "count": count }, _a));
                                        var _a;
                                    });
                                })];
                        case 2:
                            _a.sent();
                            this._count = count;
                            batch = firestore.batch();
                            collectionReference = this.reference.doc(newMember.id);
                            value = {
                                createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
                                updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                            };
                            batch.create(collectionReference, value);
                            return [2 /*return*/, batch.update(reference, newMember.value()).commit()];
                        case 3:
                            error_7 = _a.sent();
                            return [2 /*return*/, error_7];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            this.objects.push(newMember);
                            return [2 /*return*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        CountableReferenceCollection.prototype.merge = function (newMembers) {
            return __awaiter(this, void 0, void 0, function () {
                var length_1, parentRef_2, key_2, count, result, batch, i, newMember, reference, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.parent._init();
                            if (!this.isSaved()) return [3 /*break*/, 5];
                            length_1 = newMembers.length;
                            if (!(length_1 > 0)) return [3 /*break*/, 4];
                            parentRef_2 = this.parent.reference;
                            key_2 = this.key;
                            count = 0;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, firestore.runTransaction(function (transaction) {
                                    return transaction.get(parentRef_2).then(function (document) {
                                        var data = document.data();
                                        var subCollection = data[key_2] || { "count": 0 };
                                        var oldCount = subCollection["count"] || 0;
                                        count = oldCount + length_1;
                                        transaction.update(parentRef_2, (_a = {}, _a[key_2] = { "count": count }, _a));
                                        var _a;
                                    });
                                })];
                        case 2:
                            result = _a.sent();
                            this._count = count;
                            batch = firestore.batch();
                            for (i = 0; i < length_1; i++) {
                                newMember = newMembers[i];
                                reference = newMember.reference;
                                if (newMember.isSaved) {
                                    batch.update(reference, newMember.value());
                                }
                                else {
                                    batch.create(reference, newMember.value());
                                }
                            }
                            return [2 /*return*/, batch.commit()];
                        case 3:
                            error_8 = _a.sent();
                            return [2 /*return*/, error_8];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            this.objects.concat(newMembers);
                            return [2 /*return*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        CountableReferenceCollection.prototype["delete"] = function (member) {
            var _this = this;
            this.parent._init();
            if (this.isSaved()) {
                var reference_1 = member.reference;
                var parentRef_3 = this.parent.reference;
                var key_3 = this.key;
                var count = 0;
                return new Promise(function (resolve, reject) {
                    return firestore.runTransaction(function (transaction) {
                        return transaction.get(parentRef_3).then(function (document) {
                            var data = document.data();
                            var subCollection = data[key_3] || { "count": 0 };
                            var oldCount = subCollection["count"] || 0;
                            count = oldCount - 1;
                            transaction.update(parentRef_3, (_a = {}, _a[key_3] = { "count": count }, _a));
                            var _a;
                        });
                    }).then(function (result) {
                        _this._count = count;
                        var batch = firestore.batch();
                        resolve(batch["delete"](reference_1).commit());
                    })["catch"](function (error) {
                        reject(error);
                    });
                });
            }
            else {
                this.objects.some(function (v, i) {
                    if (v.id == member.id) {
                        _this.objects.splice(i, 1);
                        return true;
                    }
                    return false;
                });
                return new Promise(function (resolve, reject) {
                    resolve();
                });
            }
        };
        CountableReferenceCollection.prototype.deleteAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var snapshot, docs, batch_1, key_4, parentRef_4, result, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.parent._init();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, this.reference.get()];
                        case 2:
                            snapshot = _a.sent();
                            docs = snapshot.docs;
                            batch_1 = firestore.batch();
                            key_4 = this.key;
                            parentRef_4 = this.parent.reference;
                            return [4 /*yield*/, firestore.runTransaction(function (transaction) {
                                    return transaction.get(parentRef_4).then(function (document) {
                                        transaction.update(parentRef_4, (_a = {}, _a[key_4] = { "count": 0 }, _a));
                                        var _a;
                                    });
                                })];
                        case 3:
                            _a.sent();
                            docs.forEach(function (doc) {
                                var reference = _this.reference.doc(doc.id);
                                batch_1["delete"](reference);
                            });
                            return [4 /*yield*/, batch_1.commit()];
                        case 4:
                            result = _a.sent();
                            this.objects = [];
                            this._count = 0;
                            return [2 /*return*/, result];
                        case 5:
                            error_9 = _a.sent();
                            throw error_9;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        CountableReferenceCollection.prototype.get = function () {
            return __awaiter(this, void 0, void 0, function () {
                var snapshot, docs, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.parent._init();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.reference.get()];
                        case 2:
                            snapshot = _a.sent();
                            docs = snapshot.docs;
                            return [2 /*return*/, docs];
                        case 3:
                            error_10 = _a.sent();
                            throw error_10;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        CountableReferenceCollection.prototype.contains = function (id) {
            var _this = this;
            this.parent._init();
            return new Promise(function (resolve, reject) {
                _this.reference.doc(id).get().then(function (snapshot) {
                    resolve(snapshot.exists);
                })["catch"](function (error) {
                    reject(error);
                });
            });
        };
        CountableReferenceCollection.prototype.forEach = function (callbackfn, thisArg) {
            this.parent._init();
            this.objects.forEach(callbackfn);
        };
        CountableReferenceCollection.prototype.count = function () {
            return this.isSaved() ? this._count : this.objects.length;
        };
        CountableReferenceCollection.prototype.value = function () {
            return { "count": this.count() };
        };
        CountableReferenceCollection.prototype.setValue = function (value, key) {
            this._count = value["count"] || 0;
        };
        CountableReferenceCollection.prototype.pack = function (type, batch) {
            var batch = batch || firestore.batch();
            var self = this;
            switch (type) {
                case BatchType.save:
                    this.forEach(function (document) {
                        var doc = document;
                        var value = {
                            createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
                            updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                        };
                        var reference = self.reference.doc(document.id);
                        if (document.isSaved) {
                            document.pack(BatchType.update, batch).set(reference, value);
                        }
                        else {
                            if (document.isLocalSaved) {
                                batch.set(reference, value);
                            }
                            else {
                                document.isLocalSaved = true;
                                document.pack(BatchType.save, batch).set(reference, value);
                            }
                        }
                    });
                    return batch;
                case BatchType.update:
                    this.forEach(function (document) {
                        var doc = document;
                        if (document.isSaved) {
                            var value = {
                                updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                            };
                            var reference = self.reference.doc(document.id);
                            document.pack(BatchType.update, batch).update(reference, value);
                        }
                        else {
                            var value = {
                                createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
                                updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                            };
                            var reference = self.reference.doc(document.id);
                            if (document.isLocalSaved) {
                                batch.set(reference, value);
                            }
                            else {
                                document.isLocalSaved = true;
                                document.pack(BatchType.save, batch).set(reference, value);
                            }
                        }
                    });
                    return batch;
                case BatchType["delete"]:
                    this.forEach(function (document) {
                        var reference = self.reference.doc(document.id);
                        batch["delete"](reference);
                    });
                    return batch;
            }
        };
        CountableReferenceCollection.prototype.batch = function (type, batchID) {
            this.forEach(function (document) {
                document.batch(type, batchID);
            });
        };
        return CountableReferenceCollection;
    }());
    Pring.CountableReferenceCollection = CountableReferenceCollection;
    var CountableNestedCollection = /** @class */ (function () {
        function CountableNestedCollection(parent) {
            this.objects = [];
            this._count = 0;
            this.parent = parent;
            parent._init();
        }
        CountableNestedCollection.prototype.isSaved = function () {
            return this.parent.isSaved;
        };
        CountableNestedCollection.prototype.setParent = function (parent, key) {
            this.parent = parent;
            this.key = key;
            this.path = this.getPath();
            this.reference = this.getReference();
        };
        CountableNestedCollection.prototype.getPath = function () {
            return this.parent.path + "/" + this.key;
        };
        CountableNestedCollection.prototype.getReference = function () {
            return firestore.collection(this.getPath());
        };
        CountableNestedCollection.prototype.insert = function (newMember) {
            return __awaiter(this, void 0, void 0, function () {
                var reference, parentRef_5, key_5, count, result, batch, value, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.parent._init();
                            if (!this.isSaved()) return [3 /*break*/, 5];
                            reference = this.reference.doc(newMember.id);
                            parentRef_5 = this.parent.reference;
                            key_5 = this.key;
                            count = 0;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, firestore.runTransaction(function (transaction) {
                                    return transaction.get(parentRef_5).then(function (document) {
                                        var data = document.data();
                                        var subCollection = data[key_5] || { "count": 0 };
                                        var oldCount = subCollection["count"] || 0;
                                        count = oldCount + 1;
                                        transaction.update(parentRef_5, (_a = {}, _a[key_5] = { "count": count }, _a));
                                        var _a;
                                    });
                                })];
                        case 2:
                            result = _a.sent();
                            this._count = count;
                            batch = firestore.batch();
                            value = newMember.value();
                            value["createdAt"] = FirebaseFirestore.FieldValue.serverTimestamp();
                            batch.create(reference, value).commit();
                            return [3 /*break*/, 4];
                        case 3:
                            error_11 = _a.sent();
                            return [2 /*return*/, error_11];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            this.objects.push(newMember);
                            return [2 /*return*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        CountableNestedCollection.prototype.merge = function (newMembers) {
            return __awaiter(this, void 0, void 0, function () {
                var length_2, parentRef_6, key_6, count, result, batch, i, newMember, reference, error_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.parent._init();
                            if (!this.isSaved()) return [3 /*break*/, 5];
                            length_2 = newMembers.length;
                            if (!(length_2 > 0)) return [3 /*break*/, 4];
                            parentRef_6 = this.parent.reference;
                            key_6 = this.key;
                            count = 0;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, firestore.runTransaction(function (transaction) {
                                    return transaction.get(parentRef_6).then(function (document) {
                                        var data = document.data();
                                        var subCollection = data[key_6] || { "count": 0 };
                                        var oldCount = subCollection["count"] || 0;
                                        count = oldCount + length_2;
                                        transaction.update(parentRef_6, (_a = {}, _a[key_6] = { "count": count }, _a));
                                        var _a;
                                    });
                                })];
                        case 2:
                            result = _a.sent();
                            this._count = count;
                            batch = firestore.batch();
                            for (i = 0; i < length_2; i++) {
                                newMember = newMembers[i];
                                reference = this.reference.doc(newMember.id);
                                if (newMember.isSaved) {
                                    batch.update(reference, newMember.value());
                                }
                                else {
                                    batch.create(reference, newMember.value());
                                }
                            }
                            return [2 /*return*/, batch.commit()];
                        case 3:
                            error_12 = _a.sent();
                            return [2 /*return*/, error_12];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            this.objects.concat(newMembers);
                            return [2 /*return*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        CountableNestedCollection.prototype["delete"] = function (member) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var reference, parentRef_7, key_7, count, result, batch, error_13;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.parent._init();
                            if (!this.isSaved()) return [3 /*break*/, 5];
                            reference = this.reference.doc(member.id);
                            parentRef_7 = this.parent.reference;
                            key_7 = this.key;
                            count = 0;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, firestore.runTransaction(function (transaction) {
                                    return transaction.get(parentRef_7).then(function (document) {
                                        var data = document.data();
                                        var subCollection = data[key_7] || { "count": 0 };
                                        var oldCount = subCollection["count"] || 0;
                                        count = oldCount - 1;
                                        transaction.update(parentRef_7, (_a = {}, _a[key_7] = { "count": count }, _a));
                                        var _a;
                                    });
                                })];
                        case 2:
                            result = _a.sent();
                            this._count = count;
                            batch = firestore.batch();
                            return [2 /*return*/, batch["delete"](reference).commit()];
                        case 3:
                            error_13 = _a.sent();
                            return [2 /*return*/, error_13];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            this.objects.some(function (v, i) {
                                if (v.id == member.id) {
                                    _this.objects.splice(i, 1);
                                    return true;
                                }
                                return false;
                            });
                            _a.label = 6;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        CountableNestedCollection.prototype.deleteAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var snapshot, docs, batch_2, key_8, parentRef_8, result, error_14;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.parent._init();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, this.reference.get()];
                        case 2:
                            snapshot = _a.sent();
                            docs = snapshot.docs;
                            batch_2 = firestore.batch();
                            key_8 = this.key;
                            parentRef_8 = this.parent.reference;
                            return [4 /*yield*/, firestore.runTransaction(function (transaction) {
                                    return transaction.get(parentRef_8).then(function (document) {
                                        transaction.update(parentRef_8, (_a = {}, _a[key_8] = { "count": 0 }, _a));
                                        var _a;
                                    });
                                })];
                        case 3:
                            _a.sent();
                            docs.forEach(function (doc) {
                                var reference = _this.reference.doc(doc.id);
                                batch_2["delete"](reference);
                            });
                            return [4 /*yield*/, batch_2.commit()];
                        case 4:
                            result = _a.sent();
                            this.objects = [];
                            this._count = 0;
                            return [2 /*return*/, result];
                        case 5:
                            error_14 = _a.sent();
                            throw error_14;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        CountableNestedCollection.prototype.get = function (type) {
            return __awaiter(this, void 0, void 0, function () {
                var snapshot, docs, documents, error_15;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.parent._init();
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.reference.get()];
                        case 2:
                            snapshot = _a.sent();
                            docs = snapshot.docs;
                            documents = docs.map(function (snapshot) {
                                var document = new type();
                                document.init(snapshot);
                                return document;
                            });
                            this.objects = documents;
                            return [2 /*return*/, documents];
                        case 3:
                            error_15 = _a.sent();
                            throw error_15;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        CountableNestedCollection.prototype.contains = function (id) {
            var _this = this;
            this.parent._init();
            return new Promise(function (resolve, reject) {
                _this.reference.doc(id).get().then(function (snapshot) {
                    resolve(snapshot.exists);
                })["catch"](function (error) {
                    reject(error);
                });
            });
        };
        CountableNestedCollection.prototype.forEach = function (callbackfn, thisArg) {
            this.parent._init();
            this.objects.forEach(callbackfn);
        };
        CountableNestedCollection.prototype.count = function () {
            return this.isSaved() ? this._count : this.objects.length;
        };
        CountableNestedCollection.prototype.value = function () {
            return { "count": this.count() };
        };
        CountableNestedCollection.prototype.setValue = function (value, key) {
            this._count = value["count"] || 0;
        };
        CountableNestedCollection.prototype.pack = function (type, batch) {
            var batch = batch || firestore.batch();
            var self = this;
            switch (type) {
                case BatchType.save:
                    this.forEach(function (document) {
                        var doc = document;
                        var reference = self.reference.doc(document.id);
                        batch.set(reference, document.value());
                    });
                    return batch;
                case BatchType.update:
                    this.forEach(function (document) {
                        var doc = document;
                        if (document.isSaved) {
                            var reference = self.reference.doc(document.id);
                            batch.update(reference, document.value());
                        }
                        else {
                            var reference = self.reference.doc(document.id);
                            batch.set(reference, document.value());
                        }
                    });
                    return batch;
                case BatchType["delete"]:
                    this.forEach(function (document) {
                        var reference = self.reference.doc(document.id);
                        batch["delete"](reference);
                    });
                    return batch;
            }
        };
        CountableNestedCollection.prototype.batch = function (type, batchID) {
            this.forEach(function (document) {
                document.batch(type, batchID);
            });
        };
        return CountableNestedCollection;
    }());
    Pring.CountableNestedCollection = CountableNestedCollection;
    var File = /** @class */ (function () {
        function File(name, url, mimeType) {
            this.name = name;
            this.url = url;
            this.mimeType = mimeType;
        }
        File.prototype.init = function (value) {
            this.mimeType = value["mimeType"];
            this.name = value["name"];
            this.url = value["url"];
        };
        File.prototype.setValue = function (value, key) {
            this[key] = value;
        };
        File.prototype.value = function () {
            return {
                "name": this.name || "",
                "url": this.url || "",
                "mimeType": this.mimeType || ""
            };
        };
        return File;
    }());
    Pring.File = File;
})(Pring = exports.Pring || (exports.Pring = {}));
