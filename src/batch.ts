import * as firebase from 'firebase/app'
import { firestore } from './index'
import { WriteBatch, Base } from './base';

export enum BatchType {
    save,
    update,
    delete
}

export interface Batchable {
    batchID?: string
    pack(type: BatchType, batchID: string, batch?: firebase.firestore.WriteBatch): firebase.firestore.WriteBatch
    batch(type: BatchType, batchID: string): void
}

export class Batch {

    private _batch: WriteBatch

    constructor() {
        this._batch = firestore.batch()
    }

    add<T extends Base>(type: BatchType, object: T) {
        this._batch
        switch (type) {
            case BatchType.save:
                this._batch.set(object.reference, object._value(), { merge: true })
                break
            case BatchType.update:
                this._batch.set(object.reference, object._updateValue(), { merge: true })
                break
            case BatchType.delete:
                this._batch.delete(object.reference)
                break
        }
    }

    async commit() {
        await this._batch.commit()
    }
}