
export enum BatchType {
    save,
    update,
    delete
}

export interface Batchable {
    batchID?: string
    pack(type: BatchType, batchID: string, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch
    batch(type: BatchType, batchID: string)
}
