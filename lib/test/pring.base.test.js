"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'test';
const firebase = require("firebase");
const Pring = require("../src/index");
const config_1 = require("./config");
const document_1 = require("./document");
const app = firebase.initializeApp(config_1.config);
Pring.initialize(app.firestore(), firebase.firestore.FieldValue.serverTimestamp());
describe("Document property", () => {
    const document = new document_1.DocumentLite();
    var doc;
    beforeAll(async () => {
        document.createdAt = new Date(100);
        document.updatedAt = new Date(100);
        await document.save();
        doc = await document_1.DocumentLite.get(document.id, document_1.DocumentLite);
    });
    describe("properties", async () => {
        test("batch", () => {
            expect(Pring.firestore.batch() instanceof firebase.firestore.WriteBatch).toBeTruthy();
        });
        test("createdAt", () => {
            expect(doc.createdAt).toEqual(new Date(100));
        });
        test("updatedAt", () => {
            expect(doc.updatedAt).toEqual(new Date(100));
        });
        test("String type", () => {
            expect(doc.string).toEqual(document.string);
        });
        test("Number type", () => {
            expect(doc.number).toEqual(document.number);
        });
        test("Boolean type", () => {
            expect(doc.bool).toEqual(document.bool);
        });
        test("Date type", () => {
            expect(doc.date).toEqual(document.date);
        });
        test("Dicionary type", () => {
            expect(doc.dictionary).toEqual(document.dictionary);
        });
        test("Array type", () => {
            expect(doc.array).toEqual(document.array);
        });
        test("Set type", () => {
            expect(doc.set).toEqual(document.set);
        });
        test("File type", () => {
            expect(doc.file).toEqual(document.file);
        });
    });
    describe("Documents that do not exist", async () => {
        test("not exist", async () => {
            const doc = await document_1.DocumentLite.get("not", document_1.DocumentLite);
            expect(doc).toBeUndefined();
        });
    });
    describe("delete document", async () => {
        test("delete", async () => {
            try {
                const document_id = doc.id;
                await doc.delete();
                await document_1.DocumentLite.get(document_id, document_1.DocumentLite);
            }
            catch (error) {
                expect(error).not.toBeNull();
            }
        });
    });
});
//# sourceMappingURL=pring.base.test.js.map