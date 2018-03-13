import * as functions from 'firebase-functions';
import * as FirebaseFirestore from '@google-cloud/firestore';
import "reflect-metadata";
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
    init(snapshot: FirebaseFirestore.DocumentSnapshot | functions.firestore.DeltaDocumentSnapshot): any;
    getVersion(): number;
    getModelName(): string;
    getPath(): string;
    value(): any;
    rawValue(): any;
}
export declare function isCollection(arg: any): Boolean;
export declare function isFile(arg: any): Boolean;
export declare class Base implements Document {
    static getTriggerPath(): string;
    static getTriggerDocument(): functions.firestore.DocumentBuilder;
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
    private _updateValues;
    constructor(id?: string, value?: {
        [key: string]: any;
    });
    shouldBeReplicated(): boolean;
    self(): this;
    _init(): void;
    private _defineProperty(key, value);
    init(snapshot: FirebaseFirestore.DocumentSnapshot | functions.firestore.DeltaDocumentSnapshot): void;
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
