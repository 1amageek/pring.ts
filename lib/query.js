import * as tslib_1 from "tslib";
import * as FirebaseFirestore from '@google-cloud/firestore';
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
    get(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.query instanceof FirebaseFirestore.Query) {
                return yield this.query.get();
            }
            else {
                return yield this.query.get(options);
            }
        });
    }
}
//# sourceMappingURL=query.js.map