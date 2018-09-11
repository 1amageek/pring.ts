"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'test';
const admin = require("firebase-admin");
const FirebaseFirestore = require("@google-cloud/firestore");
const Pring = require("../src/index");
var key = require("../salada-f825d-firebase-adminsdk-19k25-ded6604978.json");
const app = admin.initializeApp({
    credential: admin.credential.cert(key)
});
Pring.initialize(app.firestore(), admin.firestore.FieldValue.serverTimestamp());
const document_1 = require("./document");
describe("Document property", () => {
    const document = new document_1.Document();
    var doc;
    beforeAll(async () => {
        document.createdAt = new Date(100);
        document.updatedAt = new Date(100);
        await document.save();
        doc = await document_1.Document.get(document.id, document_1.Document);
    });
    describe("properties", async () => {
        test("batch", () => {
            expect(Pring.firestore.batch() instanceof FirebaseFirestore.WriteBatch).toBeTruthy();
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
        test("GeoPoint type", () => {
            expect(doc.geoPoint).toEqual(document.geoPoint);
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
            const doc = await document_1.Document.get("not", document_1.Document);
            expect(doc).toBeUndefined();
        });
    });
    describe("delete document", async () => {
        test("delete", async () => {
            try {
                const document_id = doc.id;
                await doc.delete();
                await document_1.Document.get(document_id, document_1.Document);
            }
            catch (error) {
                expect(error).not.toBeNull();
            }
        });
    });
});
//# sourceMappingURL=admin.pring.base.test.js.map