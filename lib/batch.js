import * as tslib_1 from "tslib";
export var BatchType;
(function (BatchType) {
    BatchType[BatchType["save"] = 0] = "save";
    BatchType[BatchType["update"] = 1] = "update";
    BatchType[BatchType["delete"] = 2] = "delete";
})(BatchType || (BatchType = {}));
export class Batch {
    constructor(writeBatch) {
        this._writeBatch = writeBatch;
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
    set(documentRef, data, options) {
        this._writeBatch.set(documentRef, data, options);
        return this;
    }
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
    update(documentRef, data) {
        this._writeBatch.update(documentRef, data);
        return this;
    }
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
    // update(
    //     documentRef: DocumentReference,
    //     field: string | FieldPath,
    //     value: any,
    //     ...moreFieldsAndValues: any[]
    // ): Batch {
    //     if (documentRef instanceof FirebaseFirestore.DocumentReference) {
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
    delete(documentRef) {
        this._writeBatch.delete(documentRef);
        return this;
    }
    /**
     * Commits all of the writes in this write batch as a single atomic unit.
     *
     * @return A Promise resolved once all of the writes in the batch have been
     * successfully written to the backend as an atomic unit. Note that it won't
     * resolve while you're offline.
     */
    commit() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this._writeBatch.commit();
        });
    }
    batch() {
        return this._writeBatch;
    }
}
//# sourceMappingURL=batch.js.map