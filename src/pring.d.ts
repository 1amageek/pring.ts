import * as FirebaseFirestore from '@google-cloud/firestore';
import "reflect-metadata";
export declare const property: (target: any, propertyKey: any) => void;
export declare module Pring {
    function initialize(options?: any): void;
    enum BatchType {
        save = 0,
        update = 1,
        delete = 2,
    }
    interface Batchable {
        pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch;
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
        init(snapshot: FirebaseFirestore.DocumentSnapshot): any;
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
        constructor(id?: string);
        self(): this;
        _init(): void;
        init(snapshot: FirebaseFirestore.DocumentSnapshot): void;
        getVersion(): number;
        getModelName(): string;
        getPath(): string;
        getReference(): FirebaseFirestore.DocumentReference;
        getProperties(): string[];
        setValue(value: any, key: string): void;
        rawValue(): any;
        value(): any;
        pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch;
        save(): Promise<FirebaseFirestore.WriteResult[]>;
        update(): Promise<FirebaseFirestore.WriteResult>;
        delete(): Promise<FirebaseFirestore.WriteResult>;
    }
    interface SubCollection extends ValueProtocol {
        path: string;
        reference: FirebaseFirestore.CollectionReference;
        key: string;
        setParent(parent: Base, key: string): any;
        didSaved(): any;
    }
    class ReferenceCollection<T extends Base> implements SubCollection, Batchable {
        path: string;
        reference: FirebaseFirestore.CollectionReference;
        parent: Base;
        key: string;
        objects: T[];
        private _count;
        constructor(parent: Base);
        isSaved(): Boolean;
        setParent(parent: Base, key: string): void;
        didSaved(): void;
        getPath(): string;
        getReference(): FirebaseFirestore.CollectionReference;
        get(): Promise<FirebaseFirestore.DocumentSnapshot[]>;
        insert(newMember: T): Promise<any>;
        merge(newMembers: T[]): Promise<any>;
        remove(member: T): Promise<Promise<FirebaseFirestore.WriteResult[] | null>>;
        contains(id: string): Promise<Boolean>;
        forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
        count(): number;
        value(): any;
        setValue(value: any, key: string): void;
        pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch;
    }
    class NestedCollection<T extends Base> implements SubCollection, Batchable {
        path: string;
        reference: FirebaseFirestore.CollectionReference;
        parent: Base;
        key: string;
        objects: T[];
        private _count;
        constructor(parent: Base);
        isSaved(): Boolean;
        setParent(parent: Base, key: string): void;
        didSaved(): void;
        getPath(): string;
        getReference(): FirebaseFirestore.CollectionReference;
        get(): Promise<FirebaseFirestore.DocumentSnapshot[]>;
        insert(newMember: T): Promise<any>;
        merge(newMembers: T[]): Promise<any>;
        remove(member: T): Promise<any>;
        contains(id: string): Promise<Boolean>;
        forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
        count(): number;
        value(): any;
        setValue(value: any, key: string): void;
        pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch;
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
