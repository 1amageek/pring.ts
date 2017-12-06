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
        // static get<T extends Base>(id: String, done: (document: T) => void): void {
        //     firestore.doc(`${this.getPath()}/${id}`).get().then(snapshot => {
        //         let document = new this() as T
        //         document.init(snapshot)
        //         done(document)
        //     })
        // }
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
            values["createdAt"] = FirebaseFirestore.FieldValue.serverTimestamp();
            values["updatedAt"] = FirebaseFirestore.FieldValue.serverTimestamp();
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
        function ReferenceCollection() {
            this.objects = [];
            this._count = 0;
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
            this.objects.push(newMember);
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
                        var value = {
                            createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
                            updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                        };
                        var reference = _this.reference.doc(document.id.toString());
                        document.pack(type, batch).set(reference, value);
                    });
                    return batch;
                case BatchType.update:
                    this.forEach(function (document) {
                        var value = {
                            updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                        };
                        var reference = _this.reference.doc(document.id.toString());
                        document.pack(type, batch).update(reference, value);
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
})(Pring = exports.Pring || (exports.Pring = {}));
