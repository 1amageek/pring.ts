/// <reference types="node" />
import { Pring } from "../pring";
import * as FirebaseFirestore from '@google-cloud/firestore';
export declare class Document extends Pring.Base {
    array: string[];
    set: object;
    bool: boolean;
    binary: Buffer;
    file: Pring.File;
    number: number;
    date: Date;
    geoPoint: FirebaseFirestore.GeoPoint;
    dictionary: object;
    string: String;
    referenceCollection: Pring.ReferenceCollection<Document>;
    nestedCollection: Pring.NestedCollection<Document>;
}
