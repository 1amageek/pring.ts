import * as Base from './base';
import { Option, DataSource } from './dataSource';
import { FieldPath, DocumentSnapshot, QuerySnapshot, DocumentData, OrderByDirection, WhereFilterOp, GetOptions, CollectionReference } from './base';
export declare class Query<Element extends Base.Base> {
    private reference;
    private query;
    isReference: boolean;
    constructor(reference: CollectionReference, isReference?: boolean);
    dataSource(type: {
        new (id?: string, data?: DocumentData): Element;
    }, option?: Option<Element>): DataSource<Element>;
    listen(observer: {
        next?: (snapshot: QuerySnapshot) => void;
        error?: (error: Error) => void;
        complete?: () => void;
    }): () => void;
    where(fieldPath: string | FieldPath, opStr: WhereFilterOp, value: any): Query<Element>;
    orderBy(fieldPath: string | FieldPath, directionStr?: OrderByDirection): Query<Element>;
    limit(limit: number): Query<Element>;
    startAt(snapshot: DocumentSnapshot): Query<Element>;
    startAfter(snapshot: DocumentSnapshot): Query<Element>;
    endBefore(snapshot: DocumentSnapshot): Query<Element>;
    endAt(snapshot: DocumentSnapshot): Query<Element>;
    get(options?: GetOptions): Promise<import("firebase").firestore.QuerySnapshot>;
}
