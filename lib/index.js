"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FirebaseFirestore = require("@google-cloud/firestore");
const batch_1 = require("./batch");
exports.BatchType = batch_1.BatchType;
const base_1 = require("./base");
exports.Base = base_1.Base;
exports.property = base_1.property;
const subCollection_1 = require("./subCollection");
exports.SubCollection = subCollection_1.SubCollection;
const nestedCollection_1 = require("./nestedCollection");
exports.NestedCollection = nestedCollection_1.NestedCollection;
const referenceCollection_1 = require("./referenceCollection");
exports.ReferenceCollection = referenceCollection_1.ReferenceCollection;
const file_1 = require("./file");
exports.File = file_1.File;
exports.initialize = (appFirestore, serverTimestamp) => {
    exports.firestore = appFirestore;
    if (exports.firestore instanceof FirebaseFirestore.Firestore) {
        exports.firestore.settings({ timestampsInSnapshots: true });
    }
    else {
        exports.firestore.settings({ timestampsInSnapshots: true });
    }
    exports.timestamp = serverTimestamp;
};
//# sourceMappingURL=index.js.map