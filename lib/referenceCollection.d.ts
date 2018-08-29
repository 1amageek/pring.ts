import { BatchType } from './batch';
import { SubCollection } from './subCollection';
import { Base, WriteBatch, DocumentData } from './base';
export declare class ReferenceCollection<T extends Base> extends SubCollection<T> {
    insert(newMember: T): void;
    delete(member: T): void;
    pack(type: BatchType, batchID?: string, writeBatch?: WriteBatch): WriteBatch;
    doc(id: string, type: {
        new (id?: string, data?: DocumentData): T;
    }): Promise<T>;
    get(type: {
        new (id?: string, data?: DocumentData): T;
    }): Promise<T[]>;
}
