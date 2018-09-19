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
import { Option, DataSource } from './dataSource';
var Query = /** @class */ (function () {
    function Query(reference, isReference) {
        if (isReference === void 0) { isReference = false; }
        this.reference = reference;
        this.query = reference;
        this.isReference = isReference;
    }
    Query.prototype.dataSource = function (type, option) {
        if (option === void 0) { option = new Option(); }
        return new DataSource(this, option, type);
    };
    Query.prototype.listen = function (observer) {
        if (this.query instanceof FirebaseFirestore.Query) {
            return this.query.onSnapshot(observer.next, observer.error);
        }
        else {
            return this.query.onSnapshot(observer);
        }
    };
    Query.prototype.where = function (fieldPath, opStr, value) {
        var query = new Query(this.reference, this.isReference);
        query.query = this.query.where(fieldPath, opStr, value);
        return query;
    };
    Query.prototype.orderBy = function (fieldPath, directionStr) {
        var query = new Query(this.reference, this.isReference);
        query.query = this.query.orderBy(fieldPath, directionStr);
        return query;
    };
    Query.prototype.limit = function (limit) {
        var query = new Query(this.reference, this.isReference);
        query.query = this.query.limit(limit);
        return query;
    };
    Query.prototype.startAt = function (arg) {
        var query = new Query(this.reference, this.isReference);
        query.query = this.query.startAt(arg);
        return query;
    };
    Query.prototype.startAfter = function (arg) {
        var query = new Query(this.reference, this.isReference);
        query.query = this.query.startAfter(arg);
        return query;
    };
    Query.prototype.endBefore = function (arg) {
        var query = new Query(this.reference, this.isReference);
        query.query = this.query.endBefore(arg);
        return query;
    };
    Query.prototype.endAt = function (arg) {
        var query = new Query(this.reference, this.isReference);
        query.query = this.query.endAt(arg);
        return query;
    };
    Query.prototype.get = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.query instanceof FirebaseFirestore.Query)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.query.get()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.query.get(options)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Query;
}());
export { Query };
//# sourceMappingURL=query.js.map