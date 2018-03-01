import * as FirebaseFirestore from '@google-cloud/firestore';
import "reflect-metadata";
import { BatchType } from './batchable';
import { Base } from './base';
import { SubCollection } from './subCollection';
export declare class ReferenceCollection<T extends Base> extends SubCollection<T> {
    insert(newMember: T): void;
    delete(member: T): void;
    pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch;
    get(type: {
        new (id: string): T;
    }): Promise<T[]>;
}
