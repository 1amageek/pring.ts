import * as FirebaseFirestore from '@google-cloud/firestore';
export declare enum BatchType {
    save = 0,
    update = 1,
    delete = 2,
}
export interface Batchable {
    batchID?: string;
    pack(type: BatchType, batchID: string, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch;
    batch(type: BatchType, batchID: string): any;
}
