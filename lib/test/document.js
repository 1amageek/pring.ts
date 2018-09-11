"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pring = require("../src/index");
require("reflect-metadata");
const FirebaseFirestore = require("@google-cloud/firestore");
const property = Pring.property;
const File = Pring.File;
class Document extends Pring.Base {
    constructor() {
        super(...arguments);
        this.array = ["array"];
        this.set = { "set": true };
        this.bool = true;
        this.binary = Buffer.from("data", 'utf8');
        this.file = new Pring.File("file.jpg", "https://file", "image/png");
        this.number = 9223372036854776000;
        this.date = new Date(100);
        this.geoPoint = new FirebaseFirestore.GeoPoint(0, 0);
        this.dictionary = { "key": "value" };
        this.string = "string";
        this.referenceCollection = new Pring.ReferenceCollection(this);
        this.nestedCollection = new Pring.NestedCollection(this);
    }
}
__decorate([
    property
], Document.prototype, "array", void 0);
__decorate([
    property
], Document.prototype, "set", void 0);
__decorate([
    property
], Document.prototype, "bool", void 0);
__decorate([
    property
], Document.prototype, "binary", void 0);
__decorate([
    property
], Document.prototype, "file", void 0);
__decorate([
    property
], Document.prototype, "number", void 0);
__decorate([
    property
], Document.prototype, "date", void 0);
__decorate([
    property
], Document.prototype, "geoPoint", void 0);
__decorate([
    property
], Document.prototype, "dictionary", void 0);
__decorate([
    property
], Document.prototype, "string", void 0);
__decorate([
    property
], Document.prototype, "referenceCollection", void 0);
__decorate([
    property
], Document.prototype, "nestedCollection", void 0);
exports.Document = Document;
class DocumentLite extends Pring.Base {
    constructor() {
        super(...arguments);
        this.name = "";
        this.array = ["array"];
        this.set = { "set": true };
        this.bool = true;
        this.file = new Pring.File("file.jpg", "https://file", "image/png");
        this.number = 9223372036854776000;
        this.date = new Date(100);
        this.dictionary = { "key": "value" };
        this.string = "string";
        this.referenceCollection = new Pring.ReferenceCollection(this);
        this.nestedCollection = new Pring.NestedCollection(this);
    }
}
__decorate([
    property
], DocumentLite.prototype, "name", void 0);
__decorate([
    property
], DocumentLite.prototype, "array", void 0);
__decorate([
    property
], DocumentLite.prototype, "set", void 0);
__decorate([
    property
], DocumentLite.prototype, "bool", void 0);
__decorate([
    property
], DocumentLite.prototype, "file", void 0);
__decorate([
    property
], DocumentLite.prototype, "number", void 0);
__decorate([
    property
], DocumentLite.prototype, "date", void 0);
__decorate([
    property
], DocumentLite.prototype, "dictionary", void 0);
__decorate([
    property
], DocumentLite.prototype, "string", void 0);
__decorate([
    property
], DocumentLite.prototype, "referenceCollection", void 0);
__decorate([
    property
], DocumentLite.prototype, "nestedCollection", void 0);
exports.DocumentLite = DocumentLite;
//# sourceMappingURL=document.js.map