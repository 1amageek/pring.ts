import * as tslib_1 from "tslib";
import { Option, DataSource } from './dataSource';
export class Query {
    constructor(reference, isReference = false) {
        this.reference = reference;
        this.query = reference;
        this.isReference = isReference;
    }
    dataSource(type, option = new Option()) {
        return new DataSource(this, option, type);
    }
    listen(observer) {
        return this.query.onSnapshot(observer);
    }
    where(fieldPath, opStr, value) {
        const query = new Query(this.reference, this.isReference);
        query.query = this.query.where(fieldPath, opStr, value);
        return query;
    }
    orderBy(fieldPath, directionStr) {
        const query = new Query(this.reference, this.isReference);
        query.query = this.query.orderBy(fieldPath, directionStr);
        return query;
    }
    limit(limit) {
        const query = new Query(this.reference, this.isReference);
        query.query = this.query.limit(limit);
        return query;
    }
    startAt(snapshot) {
        const query = new Query(this.reference, this.isReference);
        query.query = this.query.startAt(snapshot);
        return query;
    }
    startAt(...fieldValues) {
        const query = new Query(this.reference, this.isReference);
        query.query = this.query.startAt(fieldValues);
        return query;
    }
    startAfter(snapshot) {
        const query = new Query(this.reference, this.isReference);
        query.query = this.query.startAfter(snapshot);
        return query;
    }
    startAfter(...fieldValues) {
        const query = new Query(this.reference, this.isReference);
        query.query = this.query.startAfter(fieldValues);
        return query;
    }
    endBefore(snapshot) {
        const query = new Query(this.reference, this.isReference);
        query.query = this.query.endBefore(snapshot);
        return query;
    }
    endBefore(...fieldValues) {
        const query = new Query(this.reference, this.isReference);
        query.query = this.query.endBefore(fieldValues);
        return query;
    }
    endAt(snapshot) {
        const query = new Query(this.reference, this.isReference);
        query.query = this.query.endAt(snapshot);
        return query;
    }
    endAt(...fieldValues) {
        const query = new Query(this.reference, this.isReference);
        query.query = this.query.endAt(fieldValues);
        return query;
    }
    get(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.query.get(options);
        });
    }
}
//# sourceMappingURL=query.js.map