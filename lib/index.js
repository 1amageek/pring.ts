"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const FirebaseFirestore = require("@google-cloud/firestore");
// pring export
__export(require("./base"));
function initialize(options) {
    exports.firestore = new FirebaseFirestore.Firestore(options);
}
exports.initialize = initialize;
//# sourceMappingURL=index.js.map