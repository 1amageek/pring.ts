import { BatchType } from './batch';
import { Base, AnySubCollection, CollectionReference, WriteBatch, Transaction, DocumentData } from './base';
export declare class SubCollection<T extends Base> implements AnySubCollection {
    path: string;
    reference: CollectionReference;
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
    getReference(): CollectionReference;
    insert(newMember: T): void;
    delete(member: T): void;
    doc(id: string, type: {
        new (id?: string, data?: DocumentData): T;
    }, transaction?: Transaction): Promise<T | undefined>;
    get(type: {
        new (id?: string, data?: DocumentData): T;
    }): Promise<T[]>;
    contains(id: string): Promise<boolean>;
    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
    pack(type: BatchType, batchID: string, writeBatch?: WriteBatch): WriteBatch;
    batch(type: BatchType, batchID: string): void;
}
