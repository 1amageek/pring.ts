/// <reference types="node" />
import * as Pring from "../src/index";
import "reflect-metadata";
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
export declare class DocumentLite extends Pring.Base {
    name: string;
    array: string[];
    set: object;
    bool: boolean;
    file: Pring.File;
    number: number;
    date: Date;
    dictionary: object;
    string: string;
    referenceCollection: Pring.ReferenceCollection<DocumentLite>;
    nestedCollection: Pring.NestedCollection<DocumentLite>;
}
