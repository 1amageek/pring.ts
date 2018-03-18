import * as FirebaseFirestore from '@google-cloud/firestore';
import { BatchType } from './batchable';
import { Base, AnySubCollection, DocumentData } from './base';
export declare class SubCollection<T extends Base> implements AnySubCollection {
    path: string;
    reference: FirebaseFirestore.CollectionReference;
    parent: Base;
    key: string;
    batchID?: string;
    objects: T[];
    constructor(parent: Base);
    protected _insertions: T[];
    protected _deletions: T[];
    isSaved(): Boolean;
    setParent(parent: Base, key: string): void;
    getPath(): string;
    getReference(): FirebaseFirestore.CollectionReference;
    insert(newMember: T): void;
    delete(member: T): void;
    get(type: {
        new (id?: string, data?: DocumentData): T;
    }): Promise<T[]>;
    contains(id: string): Promise<Boolean>;
    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
    pack(type: BatchType, batchID: string, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch;
    batch(type: BatchType, batchID: string): void;
}
