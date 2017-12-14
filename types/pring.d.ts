import * as FirebaseFirestore from '@google-cloud/firestore';
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
        setValue(value: any, key: String): any;
    }
    interface Document extends Batchable, ValueProtocol {
        version: Number;
        modelName: String;
        path: String;
        id: String;
        reference: FirebaseFirestore.DocumentReference;
        createdAt: Date;
        updatedAt: Date;
        init(snapshot: FirebaseFirestore.DocumentSnapshot): any;
        getVersion(): Number;
        getModelName(): String;
        getPath(): String;
        value(): any;
        rawValue(): any;
    }
    class Base implements Document {
        static getReference(): FirebaseFirestore.CollectionReference;
        static getVersion(): Number;
        static getModelName(): String;
        static getPath(): String;
        static get<T extends Base>(id: String): Promise<T>;
        version: Number;
        modelName: String;
        path: String;
        reference: FirebaseFirestore.DocumentReference;
        id: String;
        createdAt: Date;
        updatedAt: Date;
        isSaved: Boolean;
        constructor(id?: String);
        self(): this;
        _init(): void;
        init(snapshot: FirebaseFirestore.DocumentSnapshot): void;
        getVersion(): Number;
        getModelName(): String;
        getPath(): String;
        getReference(): FirebaseFirestore.DocumentReference;
        getSystemProperties(): String[];
        getProperties(): String[];
        setValue(value: any, key: String): void;
        rawValue(): any;
        value(): any;
        pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch;
        save(): Promise<FirebaseFirestore.WriteResult[]>;
        update(): Promise<FirebaseFirestore.WriteResult>;
        delete(): Promise<FirebaseFirestore.WriteResult>;
    }
    interface SubCollection extends ValueProtocol {
        path: String;
        reference: FirebaseFirestore.CollectionReference;
        key: String;
        setParent(parent: Base, key: String): any;
    }
    class ReferenceCollection<T extends Base> implements SubCollection, Batchable {
        path: String;
        reference: FirebaseFirestore.CollectionReference;
        parent: Base;
        key: String;
        objects: T[];
        private _count;
        constructor(parent: Base);
        isSaved(): Boolean;
        setParent(parent: Base, key: String): void;
        getPath(): String;
        getReference(): FirebaseFirestore.CollectionReference;
        insert(newMember: T): Promise<FirebaseFirestore.WriteResult[]>;
        remove(member: T): Promise<Promise<FirebaseFirestore.WriteResult[] | null>>;
        contains(id: String): Promise<Boolean>;
        forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
        count(): Number;
        value(): any;
        setValue(value: any, key: String): void;
        pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch;
    }
    class NestedCollection<T extends Base> implements SubCollection, Batchable {
        path: String;
        reference: FirebaseFirestore.CollectionReference;
        parent: Base;
        key: String;
        objects: T[];
        private _count;
        constructor(parent: Base);
        isSaved(): Boolean;
        setParent(parent: Base, key: String): void;
        getPath(): String;
        getReference(): FirebaseFirestore.CollectionReference;
        insert(newMember: T): Promise<FirebaseFirestore.WriteResult[] | null>;
        remove(member: T): Promise<Promise<FirebaseFirestore.WriteResult[] | null>>;
        contains(id: String): Promise<Boolean>;
        forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
        count(): Number;
        value(): any;
        setValue(value: any, key: String): void;
        pack(type: BatchType, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch;
    }
}
