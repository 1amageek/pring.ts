import * as FirebaseFirestore from '@google-cloud/firestore';
import "reflect-metadata";
import { Batchable } from './batchable';
import { Base } from './base';
export interface AnySubCollection extends Batchable {
    path: string;
    reference: FirebaseFirestore.CollectionReference;
    key: string;
    setParent(parent: Base, key: string): any;
}
