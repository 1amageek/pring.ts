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
import 'reflect-metadata';
import * as FirebaseFirestore from '@google-cloud/firestore';
import * as firebase from 'firebase';
import { BatchType, Batch } from './batch';
import { firestore } from './index';
var SubCollection = /** @class */ (function () {
    function SubCollection(parent) {
        this.objects = [];
        this._insertions = [];
        this._deletions = [];
        this.parent = parent;
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
        newMember.reference = this.reference.doc(newMember.id);
        this.objects.push(newMember);
        if (this.isSaved()) {
            this._insertions.push(newMember);
        }
    };
    SubCollection.prototype.delete = function (member) {
        var _this = this;
        this.objects.some(function (v, i) {
            if (v.id === member.id) {
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
    SubCollection.prototype.doc = function (id, type, transaction) {
        return __awaiter(this, void 0, void 0, function () {
            var snapshot, document_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        snapshot = void 0;
                        if (!transaction) return [3 /*break*/, 5];
                        if (!(transaction instanceof firebase.firestore.Transaction)) return [3 /*break*/, 2];
                        return [4 /*yield*/, transaction.get(this.reference.doc(id))];
                    case 1:
                        snapshot = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, transaction.get(this.reference.doc(id))];
                    case 3:
                        snapshot = _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.reference.doc(id).get()];
                    case 6:
                        snapshot = _a.sent();
                        _a.label = 7;
                    case 7:
                        if (snapshot.exists) {
                            document_1 = new type(snapshot.id, {});
                            document_1.setData(snapshot.data());
                            document_1.setParent(this);
                            return [2 /*return*/, document_1];
                        }
                        else {
                            return [2 /*return*/, undefined];
                        }
                        return [3 /*break*/, 9];
                    case 8:
                        error_1 = _a.sent();
                        throw error_1;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    SubCollection.prototype.get = function (type, transaction) {
        return __awaiter(this, void 0, void 0, function () {
            var snapshot, reference, docs, documents, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        snapshot = void 0;
                        if (!(transaction instanceof FirebaseFirestore.Transaction)) return [3 /*break*/, 2];
                        reference = this.reference;
                        return [4 /*yield*/, transaction.get(reference)];
                    case 1:
                        snapshot = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.reference.get()];
                    case 3:
                        snapshot = _a.sent();
                        _a.label = 4;
                    case 4:
                        docs = snapshot.docs;
                        documents = docs.map(function (documentSnapshot) {
                            var document = new type(documentSnapshot.id, {});
                            document.setData(documentSnapshot.data());
                            return document;
                        });
                        this.objects = documents;
                        return [2 /*return*/, documents];
                    case 5:
                        error_2 = _a.sent();
                        throw error_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SubCollection.prototype.contains = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var snapshot, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.reference.doc(id).get()];
                    case 1:
                        snapshot = _a.sent();
                        return [2 /*return*/, snapshot.exists];
                    case 2:
                        error_3 = _a.sent();
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SubCollection.prototype.forEach = function (callbackfn, thisArg) {
        this.objects.forEach(callbackfn);
    };
    SubCollection.prototype.pack = function (type, batchID, writeBatch) {
        var _this = this;
        var _writeBatch = writeBatch || firestore.batch();
        var _batch = new Batch(_writeBatch);
        var self = this;
        switch (type) {
            case BatchType.save:
                this.forEach(function (document) {
                    var reference = self.reference.doc(document.id);
                    if (document.isSaved) {
                        _batch.set(reference, document.value());
                    }
                    else {
                        _batch.set(reference, document.value(), { merge: true });
                    }
                });
                return _batch.batch();
            case BatchType.update:
                var insertions = this._insertions.filter(function (item) { return _this._deletions.indexOf(item) < 0; });
                insertions.forEach(function (document) {
                    var reference = self.reference.doc(document.id);
                    _batch.set(reference, document.value(), { merge: true });
                });
                var deletions = this._deletions.filter(function (item) { return _this._insertions.indexOf(item) < 0; });
                deletions.forEach(function (document) {
                    var reference = self.reference.doc(document.id);
                    _batch.delete(reference);
                });
                return _batch.batch();
            case BatchType.delete:
                this.forEach(function (document) {
                    var reference = self.reference.doc(document.id);
                    _batch.delete(reference);
                });
                return _batch.batch();
        }
    };
    SubCollection.prototype.batch = function (type, batchID) {
        this.forEach(function (document) {
            document.batch(type, batchID);
        });
    };
    return SubCollection;
}());
export { SubCollection };
//# sourceMappingURL=subCollection.js.map