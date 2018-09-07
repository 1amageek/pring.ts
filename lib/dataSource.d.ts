import { Base, QuerySnapshot, DocumentData } from './base';
import { Query } from './query';
export declare class Option<Element extends Base> {
    timeout: number;
    sortBlock?: (a: Element, b: Element) => number;
}
export declare enum Change {
    initial = "initial",
    update = "update",
    error = "error"
}
export declare class CollectionChange {
    type: Change;
    insertions: number[];
    modifications: number[];
    deletions: number[];
    constructor(type: Change, insertions: number[], modifications: number[], deletions: number[]);
}
export declare class DataSource<Element extends Base> {
    [index: number]: Element;
    query: Query<Element>;
    option: Option<Element>;
    documents: Element[];
    changeBlock?: (snapshot: QuerySnapshot, change: CollectionChange) => void;
    errorBlock?: (error: Error) => void;
    completedBlock?: (documents: Element[]) => void;
    private _Element;
    constructor(query: Query<Element>, option: Option<Element> | undefined, type: {
        new (id?: string, data?: DocumentData): Element;
    });
    doc(index: number): Element;
    on(block: (snapshot: QuerySnapshot, change: CollectionChange) => void): this;
    onError(block: (error: Error) => void): this;
    onCompleted(block: (documents: Element[]) => void): this;
    listen(): this;
    private _operate;
    private _get;
}
