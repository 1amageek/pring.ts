import * as FirebaseFirestore from '@google-cloud/firestore';
import { BatchType } from './batch';
import { Base, property } from './base';
import { SubCollection } from './subCollection';
import { NestedCollection } from './nestedCollection';
import { ReferenceCollection } from './referenceCollection';
import { File } from './file';
export { BatchType, Base, property, SubCollection, NestedCollection, ReferenceCollection, File };
export var firestore;
export var timestamp;
export var initialize = function (appFirestore, serverTimestamp) {
    firestore = appFirestore;
    if (firestore instanceof FirebaseFirestore.Firestore) {
        firestore.settings({ timestampsInSnapshots: true });
    }
    else {
        firestore.settings({ timestampsInSnapshots: true });
    }
    timestamp = serverTimestamp;
};
//# sourceMappingURL=index.js.map