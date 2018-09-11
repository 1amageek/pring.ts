"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = 'test';
const Pring = require("../src/index");
const admin = require("firebase-admin");
var key = require("../salada-f825d-firebase-adminsdk-19k25-ded6604978.json");
const app = admin.initializeApp({
    credential: admin.credential.cert(key)
});
Pring.initialize(app.firestore(), admin.firestore.FieldValue.serverTimestamp());
const document_1 = require("./document");
describe("SubCollection pack", () => {
    // NestedCollection
    const doc0_nested = new document_1.Document();
    const doc1_nested = new document_1.Document();
    const doc2_nested = new document_1.Document();
    const doc1_other_nested = new document_1.Document();
    const child = new document_1.Document();
    const doc0_nested_id = doc0_nested.id;
    const doc1_nested_id = doc1_nested.id;
    const doc2_nested_id = doc2_nested.id;
    const doc1_other_nested_id = doc1_other_nested.id;
    beforeAll(async () => {
        // Nested
        await doc1_other_nested.save();
        doc0_nested.nestedCollection.insert(doc1_nested);
        doc0_nested.nestedCollection.insert(doc1_other_nested);
        doc1_nested.nestedCollection.insert(doc2_nested);
        await doc0_nested.save();
        child.setParent(doc0_nested.nestedCollection);
        await child.save();
    });
    describe("NestedCollection", async () => {
        describe("Get NestedCollection's document", async () => {
            test("Root document", async () => {
                try {
                    const doc = await document_1.Document.get(doc0_nested_id, document_1.Document);
                    expect(doc).not.toBeNull();
                }
                catch (error) {
                    console.log(error);
                }
            });
            test("doc0's NestedCollection", async () => {
                try {
                    const doc = await new document_1.Document(doc0_nested_id).nestedCollection.get(document_1.Document);
                    expect(doc[0]).not.toBeNull();
                }
                catch (error) {
                    console.log(error);
                }
            });
            test("doc1's NestedCollection", async () => {
                try {
                    const doc = await new document_1.Document(doc1_nested_id).nestedCollection.get(document_1.Document);
                    expect(doc[0]).not.toBeNull();
                }
                catch (error) {
                    console.log(error);
                }
            });
            test("A NestedCollection saved before doc0_nested is saved", async () => {
                try {
                    const doc = await document_1.Document.get(doc1_other_nested_id, document_1.Document);
                    expect(doc).not.toBeNull();
                }
                catch (error) {
                    console.log(error);
                }
            });
            test("A NestedCollection saved before doc0_nested is saved", async () => {
                try {
                    const doc = await new document_1.Document(doc0_nested_id).nestedCollection.get(document_1.Document);
                    expect(doc[0]).not.toBeNull();
                }
                catch (error) {
                    console.log(error);
                }
            });
            test("Document saved as a child can be get", async () => {
                try {
                    const docs = await new document_1.Document(doc0_nested_id).nestedCollection.get(document_1.Document);
                    expect(docs.filter((value) => {
                        return (value.id == child.id);
                    })).toBeTruthy();
                    expect(docs[0]).not.toBeNull();
                }
                catch (error) {
                    console.log(error);
                }
            });
        });
    });
    //     describe("Document delete", async () => {
    //         test("doc 0", async () => {
    //             try {
    //                 const doc = await Document.get(doc0_id)
    //                 await doc.delete()
    //                 await Document.get(doc0_id)
    //             } catch (error) {
    //                 expect(error).not.toBeNull()
    //             }
    //         })
    //         test("doc 1", async () => {
    //             try {
    //                 const doc = await Document.get(doc1_id)
    //                 expect(doc).not.toBeNull()
    //             } catch(error) {
    //                 console.log(error)
    //             }
    //         })
    //         test("doc 2", async () => {
    //             try {
    //                 const doc = await Document.get(doc2_id)
    //                 expect(doc).not.toBeNull()
    //             } catch(error) {
    //                 console.log(error)
    //             }
    //         })
    //         test("doc 1 other", async () => {
    //             try {
    //                 const doc = await Document.get(doc1_other_id)
    //                 expect(doc).not.toBeNull()
    //             } catch(error) {
    //                 console.log(error)
    //             }
    //         })
    //     })
    // })
    describe("NestedCollection", async () => {
        describe("Get NestedCollection's document", async () => {
            test("Root document", async () => {
                try {
                    const doc = await document_1.Document.get(doc0_nested_id, document_1.Document);
                    expect(doc).not.toBeNull();
                }
                catch (error) {
                    console.log(error);
                }
            });
        });
    });
});
//# sourceMappingURL=admin.pring.nestedcollection.test.js.map