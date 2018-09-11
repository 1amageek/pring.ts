"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FirebaseFirestore = require("@google-cloud/firestore");
const dataSource_1 = require("./dataSource");
class Query {
    constructor(reference, isReference = false) {
        this.reference = reference;
        this.query = reference;
        this.isReference = isReference;
    }
    dataSource(type, option = new dataSource_1.Option()) {
        return new dataSource_1.DataSource(this, option, type);
    }
    listen(observer) {
        if (this.query instanceof FirebaseFirestore.Query) {
            return this.query.onSnapshot(observer.next, observer.error);
        }
        else {
            return this.query.onSnapshot(observer);
        }
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
    startAt(arg) {
        const query = new Query(this.reference, this.isReference);
        query.query = this.query.startAt(arg);
        return query;
    }
    startAfter(arg) {
        const query = new Query(this.reference, this.isReference);
        query.query = this.query.startAfter(arg);
        return query;
    }
    endBefore(arg) {
        const query = new Query(this.reference, this.isReference);
        query.query = this.query.endBefore(arg);
        return query;
    }
    endAt(arg) {
        const query = new Query(this.reference, this.isReference);
        query.query = this.query.endAt(arg);
        return query;
    }
    async get(options) {
        if (this.query instanceof FirebaseFirestore.Query) {
            return await this.query.get();
        }
        else {
            return await this.query.get(options);
        }
    }
}
exports.Query = Query;
//# sourceMappingURL=query.js.map