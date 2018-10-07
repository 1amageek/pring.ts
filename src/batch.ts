import * as FirebaseFirestore from '@google-cloud/firestore'
import * as firebase from 'firebase/app'
import {
    DocumentReference,
    WriteBatch,
    SetOptions,
    FieldPath,
    UpdateData,
    DocumentData,
} from './base'

export enum BatchType {
    save,
    update,
    delete
}

export interface Batchable {
    batchID?: string
    pack(type: BatchType, batchID: string, batch?: WriteBatch): WriteBatch
    batch(type: BatchType, batchID: string): void
}

export class Batch {

    private _writeBatch?: firebase.firestore.WriteBatch

    private _adminWriteBatch?: FirebaseFirestore.WriteBatch

    public constructor(writeBatch: WriteBatch) {
        if (writeBatch instanceof firebase.firestore.WriteBatch) {
            this._writeBatch = writeBatch
        }
        if (writeBatch instanceof FirebaseFirestore.WriteBatch) {
            this._adminWriteBatch = writeBatch
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
    public set(
        documentRef: DocumentReference,
        data: DocumentData,
        options?: SetOptions
    ): Batch {
        if (documentRef instanceof firebase.firestore.DocumentReference) {
            this._writeBatch!.set(documentRef, data, options)
        }
        if (documentRef instanceof FirebaseFirestore.DocumentReference) {
            this._adminWriteBatch!.set(documentRef, data, options)
        }
        return this
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
    public update(documentRef: DocumentReference, data: UpdateData): Batch {
        if (documentRef instanceof firebase.firestore.DocumentReference) {
            this._writeBatch!.update(documentRef, data)
        }
        if (documentRef instanceof FirebaseFirestore.DocumentReference) {
            this._adminWriteBatch!.update(documentRef, data)
        }
        return this
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
    public delete(documentRef: DocumentReference): Batch {
        if (documentRef instanceof firebase.firestore.DocumentReference) {
            this._writeBatch!.delete(documentRef)
        }
        if (documentRef instanceof FirebaseFirestore.DocumentReference) {
            this._adminWriteBatch!.delete(documentRef)
        }
        return this
    }

    /**
     * Commits all of the writes in this write batch as a single atomic unit.
     *
     * @return A Promise resolved once all of the writes in the batch have been
     * successfully written to the backend as an atomic unit. Note that it won't
     * resolve while you're offline.
     */
    public async commit() {
        if (this._writeBatch) {
            return await this._writeBatch!.commit()
        }
        if (this._adminWriteBatch) {
            return await this._adminWriteBatch!.commit()
        }
    }

    public batch(): WriteBatch {
        return this._writeBatch || this._adminWriteBatch!
    }
}
