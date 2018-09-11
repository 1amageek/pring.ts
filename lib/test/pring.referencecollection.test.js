"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'test';
const Pring = require("../src/index");
const firebase = require("firebase");
const document_1 = require("./document");
const config_1 = require("./config");
const app = firebase.initializeApp(config_1.config);
Pring.initialize(app.firestore(), firebase.firestore.FieldValue.serverTimestamp());
describe("SubCollection pack", () => {
    // ReferenceCollection
    const doc0 = new document_1.DocumentLite();
    const doc1 = new document_1.DocumentLite();
    const doc2 = new document_1.DocumentLite();
    const doc1_other = new document_1.DocumentLite();
    const doc2_other = new document_1.DocumentLite();
    doc0.name = "doc0";
    doc1.name = "doc1";
    doc2.name = "doc2";
    doc1_other.name = "doc1_other";
    doc2_other.name = "doc2_other";
    const doc0_id = doc0.id;
    const doc1_id = doc1.id;
    const doc2_id = doc2.id;
    const doc1_other_id = doc1_other.id;
    const doc2_other_id = doc2_other.id;
    beforeAll(async () => {
        // Reference
        await doc1_other.save();
        doc0.referenceCollection.insert(doc1);
        doc0.referenceCollection.insert(doc1_other);
        doc0.referenceCollection.insert(doc2_other);
        await doc0.save();
        doc1.referenceCollection.insert(doc2);
        doc1.referenceCollection.insert(doc2_other);
        await doc1.update();
    });
    describe("ReferenceCollection", async () => {
        describe("Get ReferenceCollection's document", async () => {
            test("Root document", async () => {
                try {
                    const doc = await document_1.DocumentLite.get(doc0_id, document_1.DocumentLite);
                    expect(doc).not.toBeNull();
                    expect(doc0.isSaved).toEqual(true);
                    expect(doc1.isSaved).toEqual(true);
                }
                catch (error) {
                    expect(error).toBeNull();
                    console.log(error);
                }
            });
            test("doc0's ReferenceCollection", async () => {
                try {
                    const doc = await document_1.DocumentLite.get(doc1_id, document_1.DocumentLite);
                    expect(doc).not.toBeNull();
                }
                catch (error) {
                    expect(error).toBeNull();
                    console.log(error);
                }
            });
            test("doc1's ReferenceCollection", async () => {
                try {
                    const doc = await document_1.DocumentLite.get(doc2_id, document_1.DocumentLite);
                    expect(doc).not.toBeNull();
                }
                catch (error) {
                    expect(error).toBeNull();
                    console.log(error);
                }
            });
            test("A ReferenceCollection saved before doc0 is saved", async () => {
                try {
                    const doc = await document_1.DocumentLite.get(doc1_other_id, document_1.DocumentLite);
                    expect(doc).not.toBeNull();
                }
                catch (error) {
                    expect(error).toBeNull();
                    console.log(error);
                }
            });
            test("This doc2_other is saved in another ReferenceCollection", async () => {
                try {
                    const doc = await document_1.DocumentLite.get(doc2_other_id, document_1.DocumentLite);
                    expect(doc).not.toBeNull();
                }
                catch (error) {
                    expect(error).toBeNull();
                    console.log(error);
                }
            });
        });
        describe("DocumentLite get reference", async () => {
            test("doc 1 reference", async () => {
                try {
                    const docs = await new document_1.DocumentLite(doc0_id).referenceCollection.get(document_1.DocumentLite);
                    for (const doc of docs) {
                        await doc.fetch();
                    }
                    expect(docs.length !== 0).toBeTruthy();
                    expect(docs.filter((value) => {
                        return (value.id == doc1_id);
                    })).toBeTruthy();
                }
                catch (error) {
                    expect(error).toBeNull();
                    console.log(error);
                }
            });
            test("doc 2 reference", async () => {
                try {
                    const docs = await new document_1.DocumentLite(doc1_id).referenceCollection.get(document_1.DocumentLite);
                    for (const doc of docs) {
                        await doc.fetch();
                    }
                    expect(docs.length !== 0).toBeTruthy();
                    expect(docs.filter((value) => {
                        return (value.id == doc2_id);
                    })).toBeTruthy();
                }
                catch (error) {
                    expect(error).toBeNull();
                    console.log(error);
                }
            });
            test("doc 1 reference before saved document", async () => {
                try {
                    const docs = await new document_1.DocumentLite(doc0_id).referenceCollection.get(document_1.DocumentLite);
                    for (const doc of docs) {
                        await doc.fetch();
                    }
                    expect(docs.length !== 0).toBeTruthy();
                    expect(docs.filter((value) => {
                        return (value.id == doc1_other_id);
                    })).toBeTruthy();
                }
                catch (error) {
                    expect(error).toBeNull();
                    console.log(error);
                }
            });
        });
        describe("Initilizeed DocumentLite get reference", async () => {
            test("doc 1 reference", async () => {
                try {
                    const docs = await new document_1.DocumentLite(doc0_id).referenceCollection.get(document_1.DocumentLite);
                    expect(docs.length !== 0).toBeTruthy();
                    expect(docs.filter((value) => {
                        return (value.id == doc1_id);
                    })).toBeTruthy();
                }
                catch (error) {
                    expect(error).toBeNull();
                    console.log(error);
                }
            });
            test("doc 2 reference", async () => {
                try {
                    const docs = await new document_1.DocumentLite(doc1_id).referenceCollection.get(document_1.DocumentLite);
                    expect(docs.length !== 0).toBeTruthy();
                    expect(docs.filter((value) => {
                        return (value.id == doc2_id);
                    })).toBeTruthy();
                }
                catch (error) {
                    expect(error).toBeNull();
                    console.log(error);
                }
            });
            test("doc 1 reference before saved document", async () => {
                try {
                    const docs = await new document_1.DocumentLite(doc0_id).referenceCollection.get(document_1.DocumentLite);
                    expect(docs.length !== 0).toBeTruthy();
                    expect(docs.filter((value) => {
                        return (value.id == doc1_other_id);
                    })).toBeTruthy();
                }
                catch (error) {
                    expect(error).toBeNull();
                    console.log(error);
                }
            });
        });
        describe("DocumentLite get reference", async () => {
            test("doc 1 reference", async () => {
                try {
                    const doc = await document_1.DocumentLite.get(doc0_id, document_1.DocumentLite);
                    const docs = await doc.referenceCollection.get(document_1.DocumentLite);
                    expect(docs.length === 3).toBeTruthy();
                    expect(docs.filter((value) => {
                        return (value.id == doc1_id);
                    })).toBeTruthy();
                }
                catch (error) {
                    expect(error).toBeNull();
                    console.log(error);
                }
            });
            test("doc 2 reference", async () => {
                try {
                    const doc = await document_1.DocumentLite.get(doc1_id, document_1.DocumentLite);
                    const docs = await doc.referenceCollection.get(document_1.DocumentLite);
                    expect(docs.length !== 0).toBeTruthy();
                    expect(docs.filter((value) => {
                        return (value.id == doc2_id);
                    })).toBeTruthy();
                }
                catch (error) {
                    expect(error).toBeNull();
                    console.log(error);
                }
            });
            test("doc 1 reference before saved document", async () => {
                try {
                    const doc = await document_1.DocumentLite.get(doc0_id, document_1.DocumentLite);
                    const docs = await doc.referenceCollection.get(document_1.DocumentLite);
                    expect(docs.length !== 0).toBeTruthy();
                    expect(docs.filter((value) => {
                        return (value.id == doc1_other_id);
                    })).toBeTruthy();
                }
                catch (error) {
                    expect(error).toBeNull();
                    console.log(error);
                }
            });
        });
    });
});
//# sourceMappingURL=pring.referencecollection.test.js.map