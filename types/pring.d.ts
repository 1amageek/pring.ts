import * as FirebaseFirestore from '@google-cloud/firestore';
import { DeltaDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import "reflect-metadata";
export declare const property: <T extends Pring.Document>(target: T, propertyKey: any) => void;
export declare module Pring {
    function initialize(options?: any): void;
    enum BatchType {
        save = 0,
        update = 1,
        delete = 2,
    }
    interface Batchable {
        batchID?: string;
        pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch;
        batch(type: BatchType, batchID: string): any;
    }
    interface ValueProtocol {
        value(): any;
        setValue(value: any, key: string): any;
    }
    interface Document extends Batchable, ValueProtocol {
        version: number;
        modelName: string;
        path: string;
        id: string;
        reference: FirebaseFirestore.DocumentReference;
        createdAt: Date;
        updatedAt: Date;
        init(snapshot: FirebaseFirestore.DocumentSnapshot | DeltaDocumentSnapshot): any;
        getVersion(): number;
        getModelName(): string;
        getPath(): string;
        value(): any;
        rawValue(): any;
    }
    class Base implements Document {
        static getReference(): FirebaseFirestore.CollectionReference;
        static getVersion(): number;
        static getModelName(): string;
        static getPath(): string;
        static self(): any;
        static get(id: string): Promise<Base>;
        version: number;
        modelName: string;
        path: string;
        reference: FirebaseFirestore.DocumentReference;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        isSaved: Boolean;
        isLocalSaved: Boolean;
        batchID?: string;
        constructor(id?: string);
        self(): this;
        _init(): void;
        init(snapshot: FirebaseFirestore.DocumentSnapshot | DeltaDocumentSnapshot): void;
        getVersion(): number;
        getModelName(): string;
        getPath(): string;
        getReference(): FirebaseFirestore.DocumentReference;
        getProperties(): string[];
        setValue(value: any, key: string): void;
        rawValue(): any;
        value(): any;
        pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch;
        batch(type: BatchType, batchID: string): void;
        save(): Promise<FirebaseFirestore.WriteResult[]>;
        update(): Promise<FirebaseFirestore.WriteResult[]>;
        delete(): Promise<FirebaseFirestore.WriteResult>;
        fetch(): Promise<void>;
    }
    interface AnySubCollection extends Batchable {
        path: string;
        reference: FirebaseFirestore.CollectionReference;
        key: string;
        setParent(parent: Base, key: string): any;
    }
    class SubCollection<T extends Base> implements AnySubCollection {
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
    class NestedCollection<T extends Base> extends SubCollection<T> {
    }
    class ReferenceCollection<T extends Base> extends SubCollection<T> {
        insert(newMember: T): void;
        delete(member: T): void;
        pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch;
        get(type: {
            new (id: string): T;
        }): Promise<T[]>;
    }
    class File implements ValueProtocol {
        mimeType: string;
        name: string;
        url: string;
        constructor(name?: string, url?: string, mimeType?: string);
        init(value: object): void;
        setValue(value: any, key: string): void;
        value(): any;
    }
}
