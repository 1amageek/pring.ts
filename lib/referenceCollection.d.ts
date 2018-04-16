import { BatchType } from './batchable';
import { Base, DocumentData } from './base';
import { SubCollection } from './subCollection';
export declare class ReferenceCollection<T extends Base> extends SubCollection<T> {
    insert(newMember: T): void;
    delete(member: T): void;
    pack(type: BatchType, batchID: string, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch;
    doc(id: string, type: {
        new (id?: string, data?: DocumentData): T;
    }): Promise<T>;
    get(type: {
        new (id?: string, data?: DocumentData): T;
    }): Promise<T[]>;
}
