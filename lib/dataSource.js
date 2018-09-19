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
import * as FirebaseFirestore from '@google-cloud/firestore';
var Option = /** @class */ (function () {
    function Option() {
        this.timeout = 10;
    }
    return Option;
}());
export { Option };
export var Change;
(function (Change) {
    Change["initial"] = "initial";
    Change["update"] = "update";
    Change["error"] = "error";
})(Change || (Change = {}));
var CollectionChange = /** @class */ (function () {
    function CollectionChange(type, insertions, modifications, deletions) {
        this.insertions = [];
        this.modifications = [];
        this.deletions = [];
        this.type = type;
        this.insertions = insertions;
        this.modifications = modifications;
        this.deletions = deletions;
    }
    return CollectionChange;
}());
export { CollectionChange };
var DataSource = /** @class */ (function () {
    function DataSource(query, option, type) {
        if (option === void 0) { option = new Option(); }
        this.documents = [];
        this.query = query;
        this.option = option;
        this._Element = type;
    }
    DataSource.prototype.doc = function (index) {
        return this.documents[index];
    };
    DataSource.prototype.on = function (block) {
        this.changeBlock = block;
        return this;
    };
    DataSource.prototype.onError = function (block) {
        this.errorBlock = block;
        return this;
    };
    DataSource.prototype.onCompleted = function (block) {
        this.completedBlock = block;
        return this;
    };
    DataSource.prototype.listen = function () {
        var _this = this;
        var isFirst = true;
        this.query.listen({
            next: function (snapshot) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!isFirst) return [3 /*break*/, 2];
                            return [4 /*yield*/, this._operate(snapshot, isFirst)];
                        case 1:
                            _a.sent();
                            isFirst = false;
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this._operate(snapshot, isFirst)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); },
            error: function (error) {
                if (_this.errorBlock) {
                    _this.errorBlock(error);
                }
            },
            complete: function () {
                if (_this.completedBlock) {
                    _this.completedBlock(_this.documents);
                }
            }
        });
        return this;
    };
    DataSource.prototype.get = function () {
        return __awaiter(this, void 0, void 0, function () {
            var snapshot, docs, promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.query.get()];
                    case 1:
                        snapshot = _a.sent();
                        docs = snapshot.docs;
                        promises = docs.map(function (doc) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this._get(doc.id, doc.data())];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); });
                        return [2 /*return*/, Promise.all(promises)];
                }
            });
        });
    };
    DataSource.prototype._operate = function (snapshot, isFirst) {
        return __awaiter(this, void 0, void 0, function () {
            var changes, collectionChange;
            var _this = this;
            return __generator(this, function (_a) {
                changes = [];
                if (snapshot instanceof FirebaseFirestore.QuerySnapshot) {
                    changes = snapshot.docChanges;
                }
                else {
                    changes = snapshot.docChanges();
                }
                changes.forEach(function (change) { return __awaiter(_this, void 0, void 0, function () {
                    var id, _a, document_1, IDs, index, collectionChange, document_2, IDs, index, collectionChange, IDs, index, collectionChange;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                id = change.doc.id;
                                _a = change.type;
                                switch (_a) {
                                    case 'added': return [3 /*break*/, 1];
                                    case 'modified': return [3 /*break*/, 3];
                                    case 'removed': return [3 /*break*/, 5];
                                }
                                return [3 /*break*/, 6];
                            case 1: return [4 /*yield*/, this._get(change.doc.id, change.doc.data())];
                            case 2:
                                document_1 = _b.sent();
                                this.documents.push(document_1);
                                this.documents = this.documents.sort(this.option.sortBlock);
                                if (!isFirst) {
                                    IDs = this.documents.map(function (doc) { return doc.id; });
                                    if (IDs.includes(id)) {
                                        index = IDs.indexOf(id);
                                        if (this.changeBlock) {
                                            collectionChange = new CollectionChange(Change.update, [index], [], []);
                                            this.changeBlock(snapshot, collectionChange);
                                        }
                                    }
                                }
                                return [3 /*break*/, 6];
                            case 3: return [4 /*yield*/, this._get(change.doc.id, change.doc.data())];
                            case 4:
                                document_2 = _b.sent();
                                this.documents = this.documents.filter(function (doc) { return doc.id !== id; });
                                this.documents.push(document_2);
                                this.documents = this.documents.sort(this.option.sortBlock);
                                IDs = this.documents.map(function (doc) { return doc.id; });
                                if (IDs.includes(id)) {
                                    index = IDs.indexOf(id);
                                    if (this.changeBlock) {
                                        collectionChange = new CollectionChange(Change.update, [], [index], []);
                                        this.changeBlock(snapshot, collectionChange);
                                    }
                                }
                                return [3 /*break*/, 6];
                            case 5:
                                {
                                    this.documents = this.documents.filter(function (doc) { return doc.id !== id; });
                                    this.documents = this.documents.sort(this.option.sortBlock);
                                    IDs = this.documents.map(function (doc) { return doc.id; });
                                    if (IDs.includes(id)) {
                                        index = IDs.indexOf(id);
                                        if (this.changeBlock) {
                                            collectionChange = new CollectionChange(Change.update, [], [], [index]);
                                            this.changeBlock(snapshot, collectionChange);
                                        }
                                    }
                                    return [3 /*break*/, 6];
                                }
                                _b.label = 6;
                            case 6: return [2 /*return*/];
                        }
                    });
                }); });
                if (isFirst) {
                    if (this.changeBlock) {
                        collectionChange = new CollectionChange(Change.initial, [], [], []);
                        this.changeBlock(snapshot, collectionChange);
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    DataSource.prototype._get = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var document_3, document_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.query.isReference) return [3 /*break*/, 2];
                        document_3 = new this._Element(id, {});
                        return [4 /*yield*/, document_3.fetch()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, document_3];
                    case 2:
                        document_4 = new this._Element(id, data);
                        return [2 /*return*/, document_4];
                }
            });
        });
    };
    return DataSource;
}());
export { DataSource };
//# sourceMappingURL=dataSource.js.map