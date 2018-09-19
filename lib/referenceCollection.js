var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
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
import { BatchType, Batch } from './batch';
import { firestore, timestamp } from './index';
import { SubCollection } from './subCollection';
var ReferenceCollection = /** @class */ (function (_super) {
    __extends(ReferenceCollection, _super);
    function ReferenceCollection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReferenceCollection.prototype.nsert = function (newMember) {
        this.objects.push(newMember);
        if (this.isSaved()) {
            this._insertions.push(newMember);
        }
    };
    ReferenceCollection.prototype.delete = function (member) {
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
    };
    ReferenceCollection.prototype.pack = function (type, batchID, writeBatch) {
        var _this = this;
        var _writeBatch = writeBatch || firestore.batch();
        var _batch = new Batch(_writeBatch);
        switch (type) {
            case BatchType.save: {
                this.forEach(function (document) {
                    var value = {};
                    if (document.shouldBeReplicated()) {
                        value = document.value();
                    }
                    value.createdAt = timestamp;
                    value.updatedAt = timestamp;
                    if (!document.isSaved) {
                        _batch.set(document.getReference(), document.value(), { merge: true });
                    }
                    var reference = _this.reference.doc(document.id);
                    _batch.set(reference, value, { merge: true });
                });
                return _batch.batch();
            }
            case BatchType.update:
                var insertions = this._insertions.filter(function (item) { return _this._deletions.indexOf(item) < 0; });
                insertions.forEach(function (document) {
                    var value = {};
                    if (document.isSaved) {
                        if (document.shouldBeReplicated()) {
                            value = document.value();
                        }
                        if (document.createdAt) {
                            value.createdAt = document.createdAt;
                        }
                        value.updatedAt = timestamp;
                        _batch.set(document.getReference(), document.value(), { merge: true });
                    }
                    else {
                        if (document.shouldBeReplicated()) {
                            value = document.value();
                        }
                        value.createdAt = timestamp;
                        value.updatedAt = timestamp;
                    }
                    var reference = _this.reference.doc(document.id);
                    _batch.set(reference, value, { merge: true });
                });
                var deletions = this._deletions.filter(function (item) { return _this._insertions.indexOf(item) < 0; });
                deletions.forEach(function (document) {
                    var reference = _this.reference.doc(document.id);
                    _batch.delete(reference);
                });
                return _batch.batch();
            case BatchType.delete:
                this.forEach(function (document) {
                    var reference = _this.reference.doc(document.id);
                    _batch.delete(reference);
                });
                return _batch.batch();
        }
    };
    ReferenceCollection.prototype.doc = function (id, type) {
        return __awaiter(this, void 0, void 0, function () {
            var document_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        document_1 = new type(id, {});
                        return [4 /*yield*/, document_1.fetch()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, document_1];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ReferenceCollection.prototype.get = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var snapshot, docs, documents, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.reference.get()];
                    case 1:
                        snapshot = _a.sent();
                        docs = snapshot.docs;
                        documents = docs.map(function (documentSnapshot) {
                            var document = new type(documentSnapshot.id, {});
                            return document;
                        });
                        this.objects = documents;
                        return [2 /*return*/, documents];
                    case 2:
                        error_2 = _a.sent();
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ReferenceCollection;
}(SubCollection));
export { ReferenceCollection };
//# sourceMappingURL=referenceCollection.js.map