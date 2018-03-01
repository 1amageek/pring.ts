import * as FirebaseFirestore from '@google-cloud/firestore';
import * as functions from 'firebase-functions';
import { DeltaDocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
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
    init(snapshot: FirebaseFirestore.DocumentSnapshot | DeltaDocumentSnapshot): any;
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
    /** Respond to all document writes (creates, updates, or deletes). */
    static onWrite(handler: (event: functions.Event<functions.firestore.DeltaDocumentSnapshot>) => PromiseLike<any> | any): functions.CloudFunction<functions.firestore.DeltaDocumentSnapshot>;
    /** Respond only to document creations. */
    static onCreate(firestore: functions.firestore.NamespaceBuilder, handler: (event: functions.Event<functions.firestore.DeltaDocumentSnapshot>) => PromiseLike<any> | any): functions.CloudFunction<functions.firestore.DeltaDocumentSnapshot>;
    /** Respond only to document updates. */
    static onUpdate(handler: (event: functions.Event<functions.firestore.DeltaDocumentSnapshot>) => PromiseLike<any> | any): functions.CloudFunction<functions.firestore.DeltaDocumentSnapshot>;
    /** Respond only to document deletions. */
    static onDelete(handler: (event: functions.Event<functions.firestore.DeltaDocumentSnapshot>) => PromiseLike<any> | any): functions.CloudFunction<functions.firestore.DeltaDocumentSnapshot>;
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
