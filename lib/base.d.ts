import * as FirebaseFirestore from '@google-cloud/firestore';
import * as firebase from 'firebase';
import "reflect-metadata";
import { NestedCollection } from './nestedCollection';
import { Batchable, BatchType } from './batch';
export declare type CollectionReference = FirebaseFirestore.CollectionReference | firebase.firestore.CollectionReference;
export declare type DocumentReference = FirebaseFirestore.DocumentReference | firebase.firestore.DocumentReference;
export declare type DocumentSnapshot = FirebaseFirestore.DocumentSnapshot | firebase.firestore.DocumentSnapshot;
export declare type Query = FirebaseFirestore.Query | firebase.firestore.Query;
export declare type QuerySnapshot = FirebaseFirestore.QuerySnapshot | firebase.firestore.QuerySnapshot;
export declare type WriteBatch = FirebaseFirestore.WriteBatch | firebase.firestore.WriteBatch;
export declare type SetOptions = FirebaseFirestore.SetOptions | firebase.firestore.SetOptions;
export declare type UpdateData = FirebaseFirestore.UpdateData | firebase.firestore.UpdateData;
export declare type FieldPath = FirebaseFirestore.FieldPath | firebase.firestore.FieldPath;
export declare type Transaction = FirebaseFirestore.Transaction | firebase.firestore.Transaction;
export declare type DocumentData = {
    createdAt: Date;
    updatedAt: Date;
} | {
    [key: string]: any;
} | FirebaseFirestore.DocumentData | firebase.firestore.DocumentData | any;
export declare type DataOrSnapshot = DocumentData | DocumentSnapshot;
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
    setParent(parent: Base, key: string): any;
}
export declare function isCollection(arg: any): Boolean;
export declare function isFile(arg: any): Boolean;
export declare function isTimestamp(arg: any): Boolean;
export declare const isUndefined: (value: any) => boolean;
export declare class Base implements Document {
    static getTriggerPath(): string;
    static getReference(): CollectionReference;
    static getVersion(): number;
    static getModelName(): string;
    static getPath(): string;
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
    isSaved: Boolean;
    isLocalSaved: Boolean;
    batchID?: string;
    private _updateValues;
    private _defineProperty;
    constructor(id?: string, data?: DocumentData);
    setData(data: DocumentData): void;
    shouldBeReplicated(): boolean;
    getVersion(): number;
    getModelName(): string;
    getPath(): string;
    getReference(): DocumentReference;
    getProperties(): string[];
    setValue(value: any, key: string): void;
    rawValue(): any;
    value(): DocumentData;
    pack(type: BatchType, batchID?: string, writeBatch?: WriteBatch): WriteBatch;
    batch(type: BatchType, batchID?: string): void;
    setParent<T extends Base>(parent: NestedCollection<T>): void;
    save(): Promise<void | FirebaseFirestore.WriteResult[]>;
    update(): Promise<void | FirebaseFirestore.WriteResult[]>;
    delete(): Promise<void | FirebaseFirestore.WriteResult>;
    fetch(transaction?: Transaction): Promise<void>;
}
