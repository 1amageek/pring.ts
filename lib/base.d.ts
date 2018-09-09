import * as FirebaseFirestore from '@google-cloud/firestore';
import * as firebase from 'firebase';
import "reflect-metadata";
import { NestedCollection } from './nestedCollection';
import { Batchable, BatchType } from './batch';
import * as DataSourceQuery from './query';
export declare type Firestore = firebase.firestore.Firestore | FirebaseFirestore.Firestore;
export declare type FieldValue = firebase.firestore.FieldValue | FirebaseFirestore.FieldValue;
export declare type CollectionReference = firebase.firestore.CollectionReference | FirebaseFirestore.CollectionReference;
export declare type DocumentReference = firebase.firestore.DocumentReference | FirebaseFirestore.DocumentReference;
export declare type DocumentSnapshot = firebase.firestore.DocumentSnapshot | FirebaseFirestore.DocumentSnapshot;
export declare type Query = firebase.firestore.Query | FirebaseFirestore.Query;
export declare type QuerySnapshot = firebase.firestore.QuerySnapshot | FirebaseFirestore.QuerySnapshot;
export declare type WriteBatch = firebase.firestore.WriteBatch | FirebaseFirestore.WriteBatch;
export declare type SetOptions = firebase.firestore.SetOptions | FirebaseFirestore.SetOptions;
export declare type UpdateData = firebase.firestore.UpdateData | FirebaseFirestore.UpdateData;
export declare type FieldPath = firebase.firestore.FieldPath | FirebaseFirestore.FieldPath;
export declare type Transaction = firebase.firestore.Transaction | FirebaseFirestore.Transaction;
export declare type DocumentData = {
    createdAt: Date;
    updatedAt: Date;
} | {
    [key: string]: any;
} | firebase.firestore.DocumentData | FirebaseFirestore.DocumentData;
export declare type DataOrSnapshot = DocumentData | DocumentSnapshot | DocumentSnapshot;
export declare type DateType = 'createdAt' | 'updatedAt';
export declare type WhereFilterOp = firebase.firestore.WhereFilterOp | FirebaseFirestore.WhereFilterOp;
export declare type OrderByDirection = firebase.firestore.OrderByDirection | FirebaseFirestore.OrderByDirection;
export declare type GetOptions = firebase.firestore.GetOptions;
export declare type DocumentChange = firebase.firestore.DocumentChange | FirebaseFirestore.DocumentChange;
export declare const property: <T extends Document>(target: T, propertyKey: string) => void;
export interface ValueProtocol {
    value(): any;
    setValue(value: any, key: string): void;
}
export interface FileData {
    mimeType: string;
    name: string;
    url: string;
}
export interface Document extends Batchable, ValueProtocol {
    [index: string]: any | null | undefined;
    version: number;
    modelName: string;
    path: string;
    id: string;
    reference: DocumentReference;
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
    reference: CollectionReference;
    key: string;
    setParent(parent: Base, key: string): void;
}
export declare function isCollection(arg: any): boolean;
export declare function isFile(arg: any): boolean;
export declare function isTimestamp(arg: any): boolean;
export declare const isUndefined: (value: any) => boolean;
export declare class Base implements Document {
    static getTriggerPath(): string;
    static getReference(): CollectionReference;
    static getVersion(): number;
    static getModelName(): string;
    static getPath(): string;
    static query<T extends Base>(): DataSourceQuery.Query<T>;
    static get<T extends Base>(id: string, type: {
        new (id?: string, data?: DocumentData): T;
    }): Promise<T>;
    version: number;
    modelName: string;
    path: string;
    reference: DocumentReference;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    isSaved: boolean;
    isLocalSaved: boolean;
    batchID?: string;
    private _updateValues;
    constructor(id?: string, data?: DocumentData);
    setData(data: DocumentData): void;
    shouldBeReplicated(): boolean;
    getVersion(): number;
    getModelName(): string;
    getPath(): string;
    getReference(): DocumentReference;
    getProperties(): string[];
    setValue<K extends keyof ThisType<this>>(value: any, key: K): void;
    rawValue(): any;
    value(): DocumentData;
    pack(type: BatchType, batchID?: string, writeBatch?: WriteBatch): WriteBatch;
    batch(type: BatchType, batchID?: string): void;
    setParent<T extends Base>(parent: NestedCollection<T>): void;
    save(): Promise<void | FirebaseFirestore.WriteResult[]>;
    update(): Promise<void | FirebaseFirestore.WriteResult[]>;
    delete(): Promise<void | FirebaseFirestore.WriteResult>;
    fetch(transaction?: Transaction): Promise<void>;
    private _defineProperty;
}
