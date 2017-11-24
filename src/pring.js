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
    var Base = /** @class */ (function () {
        function Base(id) {
            this.version = this.getVersion();
            this.modelName = this.getModelName();
            this.id = id || firestore.collection("version/" + this.version + "/" + this.modelName).doc().id;
            this.path = this.getPath();
            this.reference = this.getReference();
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
        Base.get = function (id, done) {
            var _this = this;
            firestore.doc(this.getPath() + "/" + id).get().then(function (snapshot) {
                var document = new _this();
                document.init(snapshot);
                done(document);
            });
        };
        Base.prototype.self = function () {
            return this;
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
            // Properties
            var values = snapshot.data();
            for (var key in values) {
                var value = values[key];
                Object.defineProperty(this, key, {
                    value: value,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }
            this.path = this.getPath();
            this.reference = this.getReference();
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
            return ["version", "modelName", "path", "id", "reference"];
        };
        Base.prototype.getProperties = function () {
            var properties = Object.getOwnPropertyNames(this);
            var that = this;
            return properties.filter(function (v) {
                return (that.getSystemProperties().indexOf(v) == -1);
            });
        };
        Base.prototype.save = function () {
            var properties = this.getProperties();
            var values = {
                createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
                updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
            };
            for (var prop in properties) {
                var key = properties[prop].toString();
                var value = Object.getOwnPropertyDescriptor(this, key).value;
                values[key] = value;
            }
            return this.reference.set(values);
        };
        Base.prototype.update = function () {
            var properties = this.getProperties();
            var values = {
                updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
            };
            for (var prop in properties) {
                var key = properties[prop].toString();
                var value = Object.getOwnPropertyDescriptor(this, key).value;
                values[key] = value;
            }
            return this.reference.update(values);
        };
        Base.prototype["delete"] = function () {
            return this.reference["delete"]();
        };
        return Base;
    }());
    Pring.Base = Base;
})(Pring = exports.Pring || (exports.Pring = {}));
