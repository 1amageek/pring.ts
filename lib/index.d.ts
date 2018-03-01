import * as FirebaseFirestore from '@google-cloud/firestore';
import * as base from './base';
import * as subCollection from './subCollection';
import * as nestedCollection from './nestedCollection';
import * as referenceCollection from './referenceCollection';
import * as file from './file';
export { base, subCollection, nestedCollection, referenceCollection, file };
export declare let firestore: FirebaseFirestore.Firestore;
export declare function initialize(options?: any): void;
