"use strict";
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
            switch (type) {
                case BatchType.save:
                    batch.set(reference, this.value());
                    return batch;
                case BatchType.update:
                    batch.update(reference, this.value());
                    return batch;
                case BatchType["delete"]:
                    batch["delete"](reference);
                    return batch;
            }
        };
        Base.prototype.save = function () {
            this._init();
            var batch = this.pack(BatchType.save);
            var properties = this.getProperties();
            for (var prop in properties) {
                var key = properties[prop].toString();
                var descriptor = Object.getOwnPropertyDescriptor(this, key);
                var value = descriptor.value;
                if (typeof value === "object") {
                    var collection = value;
                    var batchable = value;
                    batchable.pack(BatchType.save, batch);
                }
            }
            return batch.commit();
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
            var _this = this;
            if (this.isSaved()) {
                var reference_1 = newMember.reference;
                var parentRef_1 = this.parent.reference;
                var key_1 = this.key.toString();
                var count = 0;
                return new Promise(function (resolve, reject) {
                    return firestore.runTransaction(function (transaction) {
                        return transaction.get(parentRef_1).then(function (document) {
                            var data = document.data();
                            var subCollection = data[key_1] || { "count": 0 };
                            var oldCount = subCollection["count"] || 0;
                            count = oldCount + 1;
                            transaction.update(parentRef_1, (_a = {}, _a[key_1] = { "count": count }, _a));
                            var _a;
                        });
                    }).then(function (result) {
                        _this._count = count;
                        var batch = firestore.batch();
                        if (newMember.isSaved) {
                            resolve(batch.create(reference_1, newMember.value()).commit());
                        }
                        else {
                            resolve(batch.update(reference_1, newMember.value()).commit());
                        }
                    })["catch"](function (error) {
                        reject(error);
                    });
                });
            }
            else {
                this.objects.push(newMember);
                return new Promise(function (resolve, reject) {
                    resolve();
                });
            }
        };
        ReferenceCollection.prototype.remove = function (member) {
            var _this = this;
            if (this.isSaved()) {
                var reference_2 = member.reference;
                var parentRef_2 = this.parent.reference;
                var key_2 = this.key.toString();
                var count = 0;
                return new Promise(function (resolve, reject) {
                    return firestore.runTransaction(function (transaction) {
                        return transaction.get(parentRef_2).then(function (document) {
                            var data = document.data();
                            var subCollection = data[key_2] || { "count": 0 };
                            var oldCount = subCollection["count"] || 0;
                            count = oldCount - 1;
                            transaction.update(parentRef_2, (_a = {}, _a[key_2] = { "count": count }, _a));
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
            var _this = this;
            var batch = batch || firestore.batch();
            switch (type) {
                case BatchType.save:
                    this.forEach(function (document) {
                        var doc = document;
                        if (document.isSaved) {
                            var value = {
                                updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                            };
                            var reference = _this.reference.doc(document.id.toString());
                            document.pack(BatchType.update, batch).update(reference, value);
                        }
                        else {
                            var value = {
                                createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
                                updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                            };
                            var reference = _this.reference.doc(document.id.toString());
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
                            var reference = _this.reference.doc(document.id.toString());
                            document.pack(BatchType.update, batch).update(reference, value);
                        }
                        else {
                            var value = {
                                createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
                                updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                            };
                            var reference = _this.reference.doc(document.id.toString());
                            document.pack(BatchType.save, batch).set(reference, value);
                        }
                    });
                    return batch;
                case BatchType["delete"]:
                    this.forEach(function (document) {
                        var reference = _this.reference.doc(document.id.toString());
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
            var _this = this;
            if (this.isSaved()) {
                var reference_3 = this.reference.doc(newMember.id.toString());
                var parentRef_3 = this.parent.reference;
                var key_3 = this.key.toString();
                var count = 0;
                return new Promise(function (resolve, reject) {
                    return firestore.runTransaction(function (transaction) {
                        return transaction.get(parentRef_3).then(function (document) {
                            var data = document.data();
                            var subCollection = data[key_3] || { "count": 0 };
                            var oldCount = subCollection["count"] || 0;
                            count = oldCount + 1;
                            transaction.update(parentRef_3, (_a = {}, _a[key_3] = { "count": count }, _a));
                            var _a;
                        });
                    }).then(function (result) {
                        _this._count = count;
                        var batch = firestore.batch();
                        if (newMember.isSaved) {
                            resolve(batch.update(reference_3, newMember.value()).commit());
                        }
                        else {
                            resolve(batch.create(reference_3, newMember.value()).commit());
                        }
                    })["catch"](function (error) {
                        reject(error);
                    });
                });
            }
            else {
                this.objects.push(newMember);
                return new Promise(function (resolve, reject) {
                    resolve();
                });
            }
        };
        NestedCollection.prototype.remove = function (member) {
            var _this = this;
            if (this.isSaved()) {
                var reference_4 = this.reference.doc(member.id.toString());
                var parentRef_4 = this.parent.reference;
                var key_4 = this.key.toString();
                var count = 0;
                return new Promise(function (resolve, reject) {
                    return firestore.runTransaction(function (transaction) {
                        return transaction.get(parentRef_4).then(function (document) {
                            var data = document.data();
                            var subCollection = data[key_4] || { "count": 0 };
                            var oldCount = subCollection["count"] || 0;
                            count = oldCount - 1;
                            transaction.update(parentRef_4, (_a = {}, _a[key_4] = { "count": count }, _a));
                            var _a;
                        });
                    }).then(function (result) {
                        _this._count = count;
                        var batch = firestore.batch();
                        resolve(batch["delete"](reference_4).commit());
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
            var _this = this;
            var batch = batch || firestore.batch();
            switch (type) {
                case BatchType.save:
                    this.forEach(function (document) {
                        var doc = document;
                        if (document.isSaved) {
                            var reference = _this.reference.doc(document.id.toString());
                            batch.update(reference, document.value());
                        }
                        else {
                            var reference = _this.reference.doc(document.id.toString());
                            batch.set(reference, document.value());
                        }
                    });
                    return batch;
                case BatchType.update:
                    this.forEach(function (document) {
                        var doc = document;
                        if (document.isSaved) {
                            var reference = _this.reference.doc(document.id.toString());
                            batch.update(reference, document.value());
                        }
                        else {
                            var reference = _this.reference.doc(document.id.toString());
                            batch.set(reference, document.value());
                        }
                    });
                    return batch;
                case BatchType["delete"]:
                    this.forEach(function (document) {
                        var reference = _this.reference.doc(document.id.toString());
                        batch["delete"](reference);
                    });
                    return batch;
            }
        };
        return NestedCollection;
    }());
    Pring.NestedCollection = NestedCollection;
})(Pring = exports.Pring || (exports.Pring = {}));
