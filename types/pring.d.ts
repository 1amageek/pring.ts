import * as FirebaseFirestore from '@google-cloud/firestore';
export declare module Pring {
    function initialize(options?: any): void;
    interface Document {
        version: Number;
        modelName: String;
        path: String;
        id: String;
        createdAt: Date;
        updatedAt: Date;
        init(snapshot: FirebaseFirestore.DocumentSnapshot): any;
        getVersion(): Number;
        getModelName(): String;
        getPath(): String;
    }
    class Base implements Document {
        static getReference(): FirebaseFirestore.CollectionReference;
        static getVersion(): Number;
        static getModelName(): String;
        static getPath(): String;
        static get<T extends Base>(id: String, done: (document: T) => void): void;
        version: Number;
        modelName: String;
        path: String;
        reference: FirebaseFirestore.DocumentReference;
        id: String;
        createdAt: Date;
        updatedAt: Date;
        constructor(id?: String);
        self(): this;
        init(snapshot: FirebaseFirestore.DocumentSnapshot): void;
        getVersion(): Number;
        getModelName(): String;
        getPath(): String;
        getReference(): FirebaseFirestore.DocumentReference;
        getSystemProperties(): String[];
        getProperties(): String[];
        save(): Promise<FirebaseFirestore.WriteResult>;
        update(): Promise<FirebaseFirestore.WriteResult>;
        delete(): Promise<FirebaseFirestore.WriteResult>;
    }
}
