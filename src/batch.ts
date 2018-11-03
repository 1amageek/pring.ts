import * as firebase from 'firebase/app'

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
