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
import * as firebase from 'firebase';
export var BatchType;
(function (BatchType) {
    BatchType[BatchType["save"] = 0] = "save";
    BatchType[BatchType["update"] = 1] = "update";
    BatchType[BatchType["delete"] = 2] = "delete";
})(BatchType || (BatchType = {}));
var Batch = /** @class */ (function () {
    function Batch(writeBatch) {
        if (writeBatch instanceof firebase.firestore.WriteBatch) {
            this._writeBatch = writeBatch;
        }
        if (writeBatch instanceof FirebaseFirestore.WriteBatch) {
            this._adminWriteBatch = writeBatch;
        }
    }
    /**
     * Writes to the document referred to by the provided `DocumentReference`.
     * If the document does not exist yet, it will be created. If you pass
     * `SetOptions`, the provided data can be merged into the existing document.
     *
     * @param documentRef A reference to the document to be set.
     * @param data An object of the fields and values for the document.
     * @param options An object to configure the set behavior.
     * @return This `WriteBatch` instance. Used for chaining method calls.
     */
    Batch.prototype.set = function (documentRef, data, options) {
        if (documentRef instanceof firebase.firestore.DocumentReference) {
            this._writeBatch.set(documentRef, data, options);
        }
        if (documentRef instanceof FirebaseFirestore.DocumentReference) {
            this._adminWriteBatch.set(documentRef, data, options);
        }
        return this;
    };
    /**
     * Updates fields in the document referred to by the provided
     * `DocumentReference`. The update will fail if applied to a document that
     * does not exist.
     *
     * @param documentRef A reference to the document to be updated.
     * @param data An object containing the fields and values with which to
     * update the document. Fields can contain dots to reference nested fields
     * within the document.
     * @return This `WriteBatch` instance. Used for chaining method calls.
     */
    Batch.prototype.update = function (documentRef, data) {
        if (documentRef instanceof firebase.firestore.DocumentReference) {
            this._writeBatch.update(documentRef, data);
        }
        if (documentRef instanceof FirebaseFirestore.DocumentReference) {
            this._adminWriteBatch.update(documentRef, data);
        }
        return this;
    };
    /**
     * Updates fields in the document referred to by this `DocumentReference`.
     * The update will fail if applied to a document that does not exist.
     *
     * Nested fields can be update by providing dot-separated field path strings
     * or by providing FieldPath objects.
     *
     * @param documentRef A reference to the document to be updated.
     * @param field The first field to update.
     * @param value The first value.
     * @param moreFieldsAndValues Additional key value pairs.
     * @return A Promise resolved once the data has been successfully written
     * to the backend (Note that it won't resolve while you're offline).
     */
    // public update(documentRef: DocumentReference, data: UpdateData): Batch
    // public update(documentRef: DocumentReference, field: string | FieldPath, value: any, ...moreFieldsAndValues: any[]): Batch
    // public update(documentRef: DocumentReference, field: string | FieldPath | UpdateData, value?: any, ...moreFieldsAndValues: any[]): Batch
    // {
    //     if (documentRef instanceof FirebaseFirestore.DocumentReference) {
    //         if (field instanceof string | FieldPath) {
    //             this._adminWriteBatch.update(documentRef, field, value, moreFieldsAndValues)
    //         }
    //         this._adminWriteBatch.update(documentRef, field, value, moreFieldsAndValues)
    //     }
    //     if (documentRef instanceof firebase.firestore.DocumentReference) {
    //         this._writeBatch.update(documentRef, field, value, moreFieldsAndValues)
    //     }
    //     return this
    // }
    /**
     * Deletes the document referred to by the provided `DocumentReference`.
     *
     * @param documentRef A reference to the document to be deleted.
     * @return This `WriteBatch` instance. Used for chaining method calls.
     */
    Batch.prototype.delete = function (documentRef) {
        if (documentRef instanceof firebase.firestore.DocumentReference) {
            this._writeBatch.delete(documentRef);
        }
        if (documentRef instanceof FirebaseFirestore.DocumentReference) {
            this._adminWriteBatch.delete(documentRef);
        }
        return this;
    };
    /**
     * Commits all of the writes in this write batch as a single atomic unit.
     *
     * @return A Promise resolved once all of the writes in the batch have been
     * successfully written to the backend as an atomic unit. Note that it won't
     * resolve while you're offline.
     */
    Batch.prototype.commit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._writeBatch) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._writeBatch.commit()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (!this._adminWriteBatch) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._adminWriteBatch.commit()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Batch.prototype.batch = function () {
        return this._writeBatch || this._adminWriteBatch;
    };
    return Batch;
}());
export { Batch };
//# sourceMappingURL=batch.js.map