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
    describe("properties before get", async () => {
        test("batch", () => {
            expect(Pring.firestore.batch() instanceof FirebaseFirestore.WriteBatch).toBeTruthy();
        });
        test("String type", async () => {
            const document = new document_1.Document();
            await document.save();
            const doc = await document_1.Document.get(document.id, document_1.Document);
            doc.string = "update";
            await doc.update();
            expect(doc.string).toEqual("update");
            await doc.delete();
        });
        test("Number type", async () => {
            const document = new document_1.Document();
            await document.save();
            const doc = await document_1.Document.get(document.id, document_1.Document);
            doc.number = 100;
            await doc.update();
            expect(doc.number).toEqual(100);
            await doc.delete();
        });
        test("Boolean type", async () => {
            const document = new document_1.Document();
            await document.save();
            const doc = await document_1.Document.get(document.id, document_1.Document);
            doc.bool = false;
            await doc.update();
            expect(doc.bool).toEqual(false);
            await doc.delete();
        });
        test("Date type", async () => {
            const document = new document_1.Document();
            await document.save();
            const doc = await document_1.Document.get(document.id, document_1.Document);
            doc.date = new Date(1000);
            await doc.update();
            expect(doc.date).toEqual(new Date(1000));
            await doc.delete();
        });
        test("GeoPoint type", async () => {
            const document = new document_1.Document();
            await document.save();
            const doc = await document_1.Document.get(document.id, document_1.Document);
            doc.geoPoint = new FirebaseFirestore.GeoPoint(10, 10);
            await doc.update();
            expect(doc.geoPoint).toEqual(new FirebaseFirestore.GeoPoint(10, 10));
            await doc.delete();
        });
        test("Dicionary type", async () => {
            const document = new document_1.Document();
            await document.save();
            const doc = await document_1.Document.get(document.id, document_1.Document);
            doc.dictionary = { "key": "update" };
            await doc.update();
            expect(doc.dictionary).toEqual({ "key": "update" });
            await doc.delete();
        });
        test("Array type", async () => {
            const document = new document_1.Document();
            await document.save();
            const doc = await document_1.Document.get(document.id, document_1.Document);
            doc.array = ["update"];
            await doc.update();
            expect(doc.array).toEqual(["update"]);
            await doc.delete();
        });
        test("Set type", async () => {
            const document = new document_1.Document();
            await document.save();
            const doc = await document_1.Document.get(document.id, document_1.Document);
            doc.set = { "update": true };
            await doc.update();
            expect(doc.set).toEqual({ "update": true });
            await doc.delete();
        });
        test("File type", async () => {
            const document = new document_1.Document();
            await document.save();
            const doc = await document_1.Document.get(document.id, document_1.Document);
            doc.file = new Pring.File("update.jpg", "https://file", "image/png");
            await doc.update();
            expect(doc.file).toEqual(new Pring.File("update.jpg", "https://file", "image/png"));
            await doc.delete();
        });
    });
    describe("properties after get", async () => {
        test("batch", () => {
            expect(Pring.firestore.batch() instanceof FirebaseFirestore.WriteBatch).toBeTruthy();
        });
        test("String type", async () => {
            const document = new document_1.Document();
            await document.save();
            const doc = await document_1.Document.get(document.id, document_1.Document);
            doc.string = "update";
            await doc.update();
            const newDoc = await document_1.Document.get(document.id, document_1.Document);
            expect(newDoc.string).toEqual("update");
            await newDoc.delete();
        });
        test("Number type", async () => {
            const document = new document_1.Document();
            await document.save();
            const doc = await document_1.Document.get(document.id, document_1.Document);
            doc.number = 100;
            await doc.update();
            const newDoc = await document_1.Document.get(document.id, document_1.Document);
            expect(newDoc.number).toEqual(100);
            await newDoc.delete();
        });
        test("Boolean type", async () => {
            const document = new document_1.Document();
            await document.save();
            const doc = await document_1.Document.get(document.id, document_1.Document);
            doc.bool = false;
            await doc.update();
            const newDoc = await document_1.Document.get(document.id, document_1.Document);
            expect(newDoc.bool).toEqual(false);
            await newDoc.delete();
        });
        test("Date type", async () => {
            const document = new document_1.Document();
            await document.save();
            const doc = await document_1.Document.get(document.id, document_1.Document);
            doc.date = new Date(1000);
            await doc.update();
            const newDoc = await document_1.Document.get(document.id, document_1.Document);
            expect(newDoc.date).toEqual(new Date(1000));
            await newDoc.delete();
        });
        test("GeoPoint type", async () => {
            const document = new document_1.Document();
            await document.save();
            const doc = await document_1.Document.get(document.id, document_1.Document);
            doc.geoPoint = new FirebaseFirestore.GeoPoint(10, 10);
            await doc.update();
            const newDoc = await document_1.Document.get(document.id, document_1.Document);
            expect(newDoc.geoPoint).toEqual(new FirebaseFirestore.GeoPoint(10, 10));
            await newDoc.delete();
        });
        test("Dicionary type", async () => {
            const document = new document_1.Document();
            await document.save();
            const doc = await document_1.Document.get(document.id, document_1.Document);
            doc.dictionary = { "key": "update" };
            await doc.update();
            const newDoc = await document_1.Document.get(document.id, document_1.Document);
            expect(newDoc.dictionary).toEqual({ "key": "update" });
            await newDoc.delete();
        });
        test("Array type", async () => {
            const document = new document_1.Document();
            await document.save();
            const doc = await document_1.Document.get(document.id, document_1.Document);
            doc.array = ["update"];
            await doc.update();
            const newDoc = await document_1.Document.get(document.id, document_1.Document);
            expect(newDoc.array).toEqual(["update"]);
            await newDoc.delete();
        });
        test("Set type", async () => {
            const document = new document_1.Document();
            await document.save();
            const doc = await document_1.Document.get(document.id, document_1.Document);
            doc.set = { "update": true };
            await doc.update();
            const newDoc = await document_1.Document.get(document.id, document_1.Document);
            expect(newDoc.set).toEqual({ "update": true });
            // await newDoc.delete()
        });
        test("File type", async () => {
            const document = new document_1.Document();
            await document.save();
            const doc = await document_1.Document.get(document.id, document_1.Document);
            doc.file = new Pring.File("update.jpg", "https://file", "image/png");
            await doc.update();
            const newDoc = await document_1.Document.get(document.id, document_1.Document);
            expect(newDoc.file).toEqual(new Pring.File("update.jpg", "https://file", "image/png"));
            await newDoc.delete();
        });
    });
});
//# sourceMappingURL=admin.pring.base.update.test.js.map