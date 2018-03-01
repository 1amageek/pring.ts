"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FirebaseFirestore = require("@google-cloud/firestore");
// pring export
const base = require("./base");
exports.base = base;
const subCollection = require("./subCollection");
exports.subCollection = subCollection;
const nestedCollection = require("./nestedCollection");
exports.nestedCollection = nestedCollection;
const referenceCollection = require("./referenceCollection");
exports.referenceCollection = referenceCollection;
const file = require("./file");
exports.file = file;
function initialize(options) {
    exports.firestore = new FirebaseFirestore.Firestore(options);
}
exports.initialize = initialize;
//# sourceMappingURL=index.js.map