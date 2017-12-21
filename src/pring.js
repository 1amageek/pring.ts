"use strict";
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
            this.version = this.getVersion();
            this.modelName = this.getModelName();
            this.id = id || firestore.collection("version/" + this.version + "/" + this.modelName).doc().id;
            this.path = this.getPath();
            this.reference = this.getReference();
            this._init();
        }
        Base.getReference = function () {
            return firestore.collection(this.getPath().toString());
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
        Base.get = function (id) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                firestore.doc(_this.getPath() + "/" + id).get().then(function (snapshot) {
                    var document = new _this();
                    document.init(snapshot);
                    resolve(document);
                })["catch"](function (error) {
                    reject(error);
                });
            });
        };
        Base.prototype.self = function () {
            return this;
        };
        Base.prototype._init = function () {
            var properties = this.getProperties();
            for (var prop in properties) {
                var key = properties[prop].toString();
                var descriptor = Object.getOwnPropertyDescriptor(this, key);
                var value = descriptor.value;
                if (typeof value === "object") {
                    var collection = value;
                    collection.setParent(this, key);
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
            for (var prop in properties) {
                var key = properties[prop].toString();
                var descriptor = Object.getOwnPropertyDescriptor(this, key);
                var value = data[key];
                if (typeof descriptor.value === "object") {
                    var collection = descriptor.value;
                    collection.setParent(this, key);
                    collection.setValue(value, key);
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
            return firestore.doc(this.getPath().toString());
        };
        Base.prototype.getSystemProperties = function () {
            return ["version", "modelName", "path", "id", "reference", "isSaved"];
        };
        Base.prototype.getProperties = function () {
            var properties = Object.getOwnPropertyNames(this);
            var that = this;
            return properties.filter(function (v) {
                return (that.getSystemProperties().indexOf(v) == -1);
            });
        };
        Base.prototype.setValue = function (value, key) {
        };
        Base.prototype.rawValue = function () {
            var properties = this.getProperties();
            var values = {};
            for (var prop in properties) {
                var key = properties[prop].toString();
                var descriptor = Object.getOwnPropertyDescriptor(this, key);
                var value = descriptor.value;
                if (typeof value === "object") {
                    var collection = value;
                    values[key] = collection.value();
                }
                else {
                    values[key] = value;
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
                        var key = properties[prop].toString();
                        var descriptor = Object.getOwnPropertyDescriptor(this, key);
                        var value = descriptor.value;
                        if (typeof value === "object") {
                            var collection = value;
                            collection.setParent(this, key);
                            var batchable = value;
                            batchable.pack(BatchType.save, batch);
                        }
                    }
                    return batch;
                case BatchType.update:
                    batch.update(reference, this.value());
                    for (var prop in properties) {
                        var key = properties[prop].toString();
                        var descriptor = Object.getOwnPropertyDescriptor(this, key);
                        var value = descriptor.value;
                        if (typeof value === "object") {
                            var collection = value;
                            collection.setParent(this, key);
                            var batchable = value;
                            batchable.pack(BatchType.update, batch);
                        }
                    }
                    return batch;
                case BatchType["delete"]:
                    batch["delete"](reference);
                    return batch;
            }
        };
        Base.prototype.save = function () {
            return __awaiter(this, void 0, void 0, function () {
                var batch, result, error_1;
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
                            this.isSaved = true;
                            return [2 /*return*/, result];
                        case 3:
                            error_1 = _a.sent();
                            throw error_1;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        Base.prototype.update = function () {
            return this.reference.update(this.value());
        };
        Base.prototype["delete"] = function () {
            return this.reference["delete"]();
        };
        return Base;
    }());
    Pring.Base = Base;
    var ReferenceCollection = /** @class */ (function () {
        function ReferenceCollection(parent) {
            this.objects = [];
            this._count = 0;
            this.parent = parent;
            parent._init();
        }
        ReferenceCollection.prototype.isSaved = function () {
            return this.parent.isSaved;
        };
        ReferenceCollection.prototype.setParent = function (parent, key) {
            this.parent = parent;
            this.key = key;
            this.path = this.getPath();
            this.reference = this.getReference();
        };
        ReferenceCollection.prototype.getPath = function () {
            return this.parent.path + "/" + this.key;
        };
        ReferenceCollection.prototype.getReference = function () {
            return firestore.collection(this.getPath().toString());
        };
        ReferenceCollection.prototype.insert = function (newMember) {
            return __awaiter(this, void 0, void 0, function () {
                var reference, parentRef_1, key_1, count, result, batch, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.isSaved()) return [3 /*break*/, 5];
                            reference = newMember.reference;
                            parentRef_1 = this.parent.reference;
                            key_1 = this.key.toString();
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
                            result = _a.sent();
                            this._count = count;
                            batch = firestore.batch();
                            if (newMember.isSaved) {
                                return [2 /*return*/, batch.update(reference, newMember.value()).commit()];
                            }
                            else {
                                return [2 /*return*/, batch.create(reference, newMember.value()).commit()];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            return [2 /*return*/, error_2];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            this.objects.push(newMember);
                            return [2 /*return*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        ReferenceCollection.prototype.merge = function (newMembers) {
            return __awaiter(this, void 0, void 0, function () {
                var length_1, parentRef_2, key_2, count, result, batch, i, newMember, reference, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.isSaved()) return [3 /*break*/, 5];
                            length_1 = newMembers.length;
                            if (!(length_1 > 0)) return [3 /*break*/, 4];
                            parentRef_2 = this.parent.reference;
                            key_2 = this.key.toString();
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
                            error_3 = _a.sent();
                            return [2 /*return*/, error_3];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            this.objects.concat(newMembers);
                            return [2 /*return*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        ReferenceCollection.prototype.remove = function (member) {
            var _this = this;
            if (this.isSaved()) {
                var reference_1 = member.reference;
                var parentRef_3 = this.parent.reference;
                var key_3 = this.key.toString();
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
        ReferenceCollection.prototype.contains = function (id) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.reference.doc(id.toString()).get().then(function (snapshot) {
                    resolve(snapshot.exists);
                })["catch"](function (error) {
                    reject(error);
                });
            });
        };
        ReferenceCollection.prototype.forEach = function (callbackfn, thisArg) {
            this.objects.forEach(callbackfn);
        };
        ReferenceCollection.prototype.count = function () {
            return this.isSaved() ? this._count : this.objects.length;
        };
        ReferenceCollection.prototype.value = function () {
            return { "count": this.count() };
        };
        ReferenceCollection.prototype.setValue = function (value, key) {
            this._count = value["count"] || 0;
        };
        ReferenceCollection.prototype.pack = function (type, batch) {
            var batch = batch || firestore.batch();
            var self = this;
            switch (type) {
                case BatchType.save:
                    this.forEach(function (document) {
                        var doc = document;
                        if (document.isSaved) {
                            var value = {
                                updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                            };
                            var reference = self.reference.doc(document.id.toString());
                            document.pack(BatchType.update, batch).update(reference, value);
                        }
                        else {
                            var value = {
                                createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
                                updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                            };
                            var reference = self.reference.doc(document.id.toString());
                            document.pack(BatchType.save, batch).set(reference, value);
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
                            var reference = self.reference.doc(document.id.toString());
                            document.pack(BatchType.update, batch).update(reference, value);
                        }
                        else {
                            var value = {
                                createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
                                updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                            };
                            var reference = self.reference.doc(document.id.toString());
                            document.pack(BatchType.save, batch).set(reference, value);
                        }
                    });
                    return batch;
                case BatchType["delete"]:
                    this.forEach(function (document) {
                        var reference = self.reference.doc(document.id.toString());
                        batch["delete"](reference);
                    });
                    return batch;
            }
        };
        return ReferenceCollection;
    }());
    Pring.ReferenceCollection = ReferenceCollection;
    var NestedCollection = /** @class */ (function () {
        function NestedCollection(parent) {
            this.objects = [];
            this._count = 0;
            this.parent = parent;
            parent._init();
        }
        NestedCollection.prototype.isSaved = function () {
            return this.parent.isSaved;
        };
        NestedCollection.prototype.setParent = function (parent, key) {
            this.parent = parent;
            this.key = key;
            this.path = this.getPath();
            this.reference = this.getReference();
        };
        NestedCollection.prototype.getPath = function () {
            return this.parent.path + "/" + this.key;
        };
        NestedCollection.prototype.getReference = function () {
            return firestore.collection(this.getPath().toString());
        };
        NestedCollection.prototype.insert = function (newMember) {
            return __awaiter(this, void 0, void 0, function () {
                var reference, parentRef_4, key_4, count, result, batch, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.isSaved()) return [3 /*break*/, 5];
                            reference = this.reference.doc(newMember.id.toString());
                            parentRef_4 = this.parent.reference;
                            key_4 = this.key.toString();
                            count = 0;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, firestore.runTransaction(function (transaction) {
                                    return transaction.get(parentRef_4).then(function (document) {
                                        var data = document.data();
                                        var subCollection = data[key_4] || { "count": 0 };
                                        var oldCount = subCollection["count"] || 0;
                                        count = oldCount + 1;
                                        transaction.update(parentRef_4, (_a = {}, _a[key_4] = { "count": count }, _a));
                                        var _a;
                                    });
                                })];
                        case 2:
                            result = _a.sent();
                            this._count = count;
                            batch = firestore.batch();
                            if (newMember.isSaved) {
                                return [2 /*return*/, batch.update(reference, newMember.value()).commit()];
                            }
                            else {
                                return [2 /*return*/, batch.create(reference, newMember.value()).commit()];
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            error_4 = _a.sent();
                            return [2 /*return*/, error_4];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            this.objects.push(newMember);
                            return [2 /*return*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        NestedCollection.prototype.merge = function (newMembers) {
            return __awaiter(this, void 0, void 0, function () {
                var length_2, parentRef_5, key_5, count, result, batch, i, newMember, reference, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.isSaved()) return [3 /*break*/, 5];
                            length_2 = newMembers.length;
                            if (!(length_2 > 0)) return [3 /*break*/, 4];
                            parentRef_5 = this.parent.reference;
                            key_5 = this.key.toString();
                            count = 0;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, firestore.runTransaction(function (transaction) {
                                    return transaction.get(parentRef_5).then(function (document) {
                                        var data = document.data();
                                        var subCollection = data[key_5] || { "count": 0 };
                                        var oldCount = subCollection["count"] || 0;
                                        count = oldCount + length_2;
                                        transaction.update(parentRef_5, (_a = {}, _a[key_5] = { "count": count }, _a));
                                        var _a;
                                    });
                                })];
                        case 2:
                            result = _a.sent();
                            this._count = count;
                            batch = firestore.batch();
                            for (i = 0; i < length_2; i++) {
                                newMember = newMembers[i];
                                reference = this.reference.doc(newMember.id.toString());
                                if (newMember.isSaved) {
                                    batch.update(reference, newMember.value());
                                }
                                else {
                                    batch.create(reference, newMember.value());
                                }
                            }
                            return [2 /*return*/, batch.commit()];
                        case 3:
                            error_5 = _a.sent();
                            return [2 /*return*/, error_5];
                        case 4: return [3 /*break*/, 6];
                        case 5:
                            this.objects.concat(newMembers);
                            return [2 /*return*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        NestedCollection.prototype.remove = function (member) {
            var _this = this;
            if (this.isSaved()) {
                var reference_2 = this.reference.doc(member.id.toString());
                var parentRef_6 = this.parent.reference;
                var key_6 = this.key.toString();
                var count = 0;
                return new Promise(function (resolve, reject) {
                    return firestore.runTransaction(function (transaction) {
                        return transaction.get(parentRef_6).then(function (document) {
                            var data = document.data();
                            var subCollection = data[key_6] || { "count": 0 };
                            var oldCount = subCollection["count"] || 0;
                            count = oldCount - 1;
                            transaction.update(parentRef_6, (_a = {}, _a[key_6] = { "count": count }, _a));
                            var _a;
                        });
                    }).then(function (result) {
                        _this._count = count;
                        var batch = firestore.batch();
                        resolve(batch["delete"](reference_2).commit());
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
        NestedCollection.prototype.contains = function (id) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.reference.doc(id.toString()).get().then(function (snapshot) {
                    resolve(snapshot.exists);
                })["catch"](function (error) {
                    reject(error);
                });
            });
        };
        NestedCollection.prototype.forEach = function (callbackfn, thisArg) {
            this.objects.forEach(callbackfn);
        };
        NestedCollection.prototype.count = function () {
            return this.isSaved() ? this._count : this.objects.length;
        };
        NestedCollection.prototype.value = function () {
            return { "count": this.count() };
        };
        NestedCollection.prototype.setValue = function (value, key) {
            this._count = value["count"] || 0;
        };
        NestedCollection.prototype.pack = function (type, batch) {
            var batch = batch || firestore.batch();
            var self = this;
            switch (type) {
                case BatchType.save:
                    this.forEach(function (document) {
                        var doc = document;
                        if (document.isSaved) {
                            var reference = self.reference.doc(document.id.toString());
                            batch.update(reference, document.value());
                        }
                        else {
                            var reference = self.reference.doc(document.id.toString());
                            batch.set(reference, document.value());
                        }
                    });
                    return batch;
                case BatchType.update:
                    this.forEach(function (document) {
                        var doc = document;
                        if (document.isSaved) {
                            var reference = self.reference.doc(document.id.toString());
                            batch.update(reference, document.value());
                        }
                        else {
                            var reference = self.reference.doc(document.id.toString());
                            batch.set(reference, document.value());
                        }
                    });
                    return batch;
                case BatchType["delete"]:
                    this.forEach(function (document) {
                        var reference = self.reference.doc(document.id.toString());
                        batch["delete"](reference);
                    });
                    return batch;
            }
        };
        return NestedCollection;
    }());
    Pring.NestedCollection = NestedCollection;
})(Pring = exports.Pring || (exports.Pring = {}));
