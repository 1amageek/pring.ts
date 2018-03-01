"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FirebaseFirestore = require("@google-cloud/firestore");
// pring export
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
function initialize(options) {
    exports.firestore = new FirebaseFirestore.Firestore(options);
}
exports.initialize = initialize;
//# sourceMappingURL=index.js.map