import * as functions from 'firebase-functions';
import "reflect-metadata";
import { NestedCollection } from './nestedCollection';
import { Batchable, BatchType } from './batchable';
export declare const property: <T extends Document>(target: T, propertyKey: any) => void;
export interface ValueProtocol {
    value(): any;
    setValue(value: any, key: string): any;
}
export interface Document extends Batchable, ValueProtocol {
    version: number;
    modelName: string;
    path: string;
    id: string;
    reference: FirebaseFirestore.DocumentReference;
    createdAt: Date;
    updatedAt: Date;
    getVersion(): number;
    getModelName(): string;
    getPath(): string;
    value(): any;
    rawValue(): any;
}
export interface AnySubCollection extends Batchable {
    path: string;
    reference: FirebaseFirestore.CollectionReference;
    key: string;
    setParent(parent: Base, key: string): any;
}
export declare function isCollection(arg: any): Boolean;
export declare function isFile(arg: any): Boolean;
export declare const isUndefined: (value: any) => boolean;
export declare type DocumentData = {
    createdAt: Date;
    updatedAt: Date;
} | {
    [key: string]: any;
} | FirebaseFirestore.DocumentData | any;
export declare type Snapshot = FirebaseFirestore.DocumentSnapshot;
export declare type DataOrSnapshot = DocumentData | Snapshot;
export declare class Base implements Document {
    static getTriggerPath(): string;
    static getTriggerDocument(): functions.firestore.DocumentBuilder;
    static getReference(): FirebaseFirestore.CollectionReference;
    static getVersion(): number;
    static getModelName(): string;
    static getPath(): string;
    static get<T extends Base>(id: string, type: {
        new (id?: string, data?: DocumentData): T;
    }): Promise<T>;
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
    private _updateValues;
    private _defineProperty(key, value?);
    constructor(id?: string, data?: DocumentData);
    setData(data: DocumentData): void;
    shouldBeReplicated(): boolean;
    getVersion(): number;
    getModelName(): string;
    getPath(): string;
    getReference(): FirebaseFirestore.DocumentReference;
    getProperties(): string[];
    setValue(value: any, key: string): void;
    rawValue(): any;
    value(): any;
    pack(type: BatchType, batchID?: string, batch?: FirebaseFirestore.WriteBatch): FirebaseFirestore.WriteBatch;
    batch(type: BatchType, batchID?: string): void;
    setParent<T extends Base>(parent: NestedCollection<T>): void;
    save(): Promise<FirebaseFirestore.WriteResult[]>;
    update(): Promise<FirebaseFirestore.WriteResult[]>;
    delete(): Promise<FirebaseFirestore.WriteResult>;
    fetch(): Promise<void>;
}
