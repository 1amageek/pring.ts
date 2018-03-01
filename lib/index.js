"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FirebaseFirestore = require("@google-cloud/firestore");
// pring export
const base_1 = require("./base");
exports.Base = base_1.Base;
exports.property = base_1.property;
const SubCollection = require("./subCollection");
exports.SubCollection = SubCollection;
const NestedCollection = require("./nestedCollection");
exports.NestedCollection = NestedCollection;
const ReferenceCollection = require("./referenceCollection");
exports.ReferenceCollection = ReferenceCollection;
const File = require("./file");
exports.File = File;
function initialize(options) {
    exports.firestore = new FirebaseFirestore.Firestore(options);
}
exports.initialize = initialize;
//# sourceMappingURL=index.js.map