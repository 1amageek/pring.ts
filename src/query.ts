import * as Base from './base'
import { Option, DataSource } from './dataSource'
import {
    FieldPath,
    DocumentSnapshot,
    QuerySnapshot,
    WriteBatch,
    DocumentData,
    OrderByDirection,
    WhereFilterOp,
    GetOptions,
    CollectionReference,
} from './base'


export class Query {

    private reference: CollectionReference

    private query: Base.Query

    private isReference: boolean

    constructor(reference: CollectionReference, isReference: boolean = false) {
        this.reference = reference
        this.query = reference
        this.isReference = isReference
    }

    public dataSource<T extends Base.Base>(option: Option = new Option()): DataSource<T> {
        return new DataSource(this, option)
    }

    public listen(observer: {
        next?: (snapshot: QuerySnapshot) => void;
        error?: (error: Error) => void;
        complete?: () => void;
      }) {
        return this.query.onSnapshot(observer)
    }

    public where(fieldPath: string | FieldPath, opStr: WhereFilterOp, value: any): Query {
        const query: Query = new Query(this.reference, this.isReference)
        query.query = this.query.where(fieldPath, opStr, value)
        return query
    }

    public orderBy(fieldPath: string | FieldPath, directionStr?: OrderByDirection) {
        const query: Query = new Query(this.reference, this.isReference)
        query.query = this.query.orderBy(fieldPath, directionStr)
        return query
    }

    public limit(limit: number) {
        const query: Query = new Query(this.reference, this.isReference)
        query.query = this.query.limit(limit)
        return query
    }

    public startAt(snapshot: DocumentSnapshot) {
        const query: Query = new Query(this.reference, this.isReference)
        query.query = this.query.startAt(snapshot)
        return query
    }

    public startAt(...fieldValues: any[]) {
        const query: Query = new Query(this.reference, this.isReference)
        query.query = this.query.startAt(fieldValues)
        return query
    }

    public startAfter(snapshot: DocumentSnapshot) {
        const query: Query = new Query(this.reference, this.isReference)
        query.query = this.query.startAfter(snapshot)
        return query
    }

    public startAfter(...fieldValues: any[]){
        const query: Query = new Query(this.reference, this.isReference)
        query.query = this.query.startAfter(fieldValues)
        return query
    }

    public endBefore(snapshot: DocumentSnapshot){
        const query: Query = new Query(this.reference, this.isReference)
        query.query = this.query.endBefore(snapshot)
        return query
    }

    public endBefore(...fieldValues: any[]) {
        const query: Query = new Query(this.reference, this.isReference)
        query.query = this.query.endBefore(fieldValues)
        return query
    }

    public endAt(snapshot: DocumentSnapshot) {
        const query: Query = new Query(this.reference, this.isReference)
        query.query = this.query.endAt(snapshot)
        return query
    }

    public endAt(...fieldValues: any[]) {
        const query: Query = new Query(this.reference, this.isReference)
        query.query = this.query.endAt(fieldValues)
        return query
    }

    public async get(options?: GetOptions) {
        return this.query.get(options)
    }

}