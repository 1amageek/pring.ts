import * as Base from './base'
import { Option, DataSource } from './dataSource'
import {
    FieldPath,
    DocumentSnapshot,
    QuerySnapshot,
    OrderByDirection,
    WhereFilterOp,
    GetOptions
} from './base'

export class Query<Element extends typeof Base.Base> {

    public isReference: boolean

    private query: Base.Query

    private _Element: Element

    public constructor(reference: Base.Query, type: Element, isReference: boolean = false) {
        this._Element = type
        this.query = reference
        this.isReference = isReference
    }

    public dataSource(
        option: Option<Element> = new Option()): DataSource<Element> {
        return new DataSource(this, option, this._Element)
    }

    public listen(observer: {
        next?: (snapshot: QuerySnapshot) => void;
        error?: (error: Error) => void;
        complete?: () => void;
    }): () => void {
        return this.query.onSnapshot(observer)
    }

    public where(fieldPath: string | FieldPath, opStr: WhereFilterOp, value: any): Query<Element> {
        const query: Query<Element> = new Query(this.query, this._Element, this.isReference)
        query.query = this.query.where(fieldPath, opStr, value)
        return query
    }

    public orderBy(fieldPath: string | FieldPath, directionStr?: OrderByDirection): Query<Element> {
        const query: Query<Element> = new Query(this.query, this._Element, this.isReference)
        query.query = this.query.orderBy(fieldPath, directionStr)
        return query
    }

    public limit(limit: number): Query<Element> {
        const query: Query<Element> = new Query(this.query, this._Element, this.isReference)
        query.query = this.query.limit(limit)
        return query
    }

    public startAt(snapshot: DocumentSnapshot): Query<Element>
    public startAt(...fieldValues: any[]): Query<Element>
    public startAt(arg: DocumentSnapshot | any[]): Query<Element> {
        const query: Query<Element> = new Query(this.query, this._Element, this.isReference)
        query.query = this.query.startAt(arg)
        return query
    }

    public startAfter(snapshot: DocumentSnapshot): Query<Element>
    public startAfter(...fieldValues: any[]): Query<Element>
    public startAfter(arg: DocumentSnapshot | any[]): Query<Element> {
        const query: Query<Element> = new Query(this.query, this._Element, this.isReference)
        query.query = this.query.startAfter(arg)
        return query
    }

    public endBefore(snapshot: DocumentSnapshot): Query<Element>
    public endBefore(...fieldValues: any[]): Query<Element>
    public endBefore(arg: DocumentSnapshot | any[]): Query<Element> {
        const query: Query<Element> = new Query(this.query, this._Element, this.isReference)
        query.query = this.query.endBefore(arg)
        return query
    }

    public endAt(snapshot: DocumentSnapshot): Query<Element>
    public endAt(...fieldValues: any[]): Query<Element>
    public endAt(arg: DocumentSnapshot | any[]): Query<Element> {
        const query: Query<Element> = new Query(this.query, this._Element, this.isReference)
        query.query = this.query.endAt(arg)
        return query
    }

    public async get(options?: GetOptions) {
        return await this.query.get(options)
    }
}
