import * as FirebaseFirestore from '@google-cloud/firestore';
import { Base, property } from './base';
import * as SubCollection from './subCollection';
import * as NestedCollection from './nestedCollection';
import * as ReferenceCollection from './referenceCollection';
import * as File from './file';
export { Base, property, SubCollection, NestedCollection, ReferenceCollection, File };
export declare let firestore: FirebaseFirestore.Firestore;
export declare function initialize(options?: any): void;
