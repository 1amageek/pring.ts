import * as FirebaseFirestore from '@google-cloud/firestore';
import "reflect-metadata";
import { Base, Batchable, BatchType } from './base';
export interface AnySubCollection extends Batchable {
    path: string;
    reference: FirebaseFirestore.CollectionReference;
    key: string;
    setParent(parent: Base, key: string): any;
}
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
        new (): T;
    }): Promise<T[]>;
    contains(id: string): Promise<Boolean>;
    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
    pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch;
    batch(type: BatchType, batchID: string): void;
}
