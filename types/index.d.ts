import * as FirebaseFirestore from '@google-cloud/firestore';
export * from './base';
export * from './subCollection';
export * from './nestedCollection';
export * from './referenceCollection';
export * from './file';
export declare let firestore: FirebaseFirestore.Firestore;
export declare function initialize(options?: any): void;
