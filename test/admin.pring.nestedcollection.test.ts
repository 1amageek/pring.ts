process.env.NODE_ENV = 'test';
import * as Pring from "../src/index"
import * as admin from 'firebase-admin'

var key = require("../key.json")
const app = admin.initializeApp({
    credential: admin.credential.cert(key)
})

Pring.initialize(app.firestore(), admin.firestore.FieldValue.serverTimestamp())

import { Document } from './document'

describe("SubCollection pack", () => {

    // NestedCollection
    const doc0_nested = new Document()
    const doc1_nested = new Document()
    const doc2_nested = new Document()
    const doc1_other_nested = new Document()
    const child = new Document()

    const doc0_nested_id = doc0_nested.id
    const doc1_nested_id = doc1_nested.id
    const doc2_nested_id = doc2_nested.id
    const doc1_other_nested_id = doc1_other_nested.id

    beforeAll(async () => {
        // Nested

        await doc1_other_nested.save()
        doc0_nested.nestedCollection.insert(doc1_nested)
        doc0_nested.nestedCollection.insert(doc1_other_nested)
        doc1_nested.nestedCollection.insert(doc2_nested)
        await doc0_nested.save()

        child.setParent(doc0_nested.nestedCollection)
        await child.save()
    });

    describe("NestedCollection", async () => {
        describe("Get NestedCollection's document", async () => {

            test("Root document", async () => {
                try {
                    const doc: Document = await Document.get(doc0_nested_id) as Document
                    expect(doc).not.toBeUndefined()
                    expect(doc).not.toBeNull()
                    expect(doc.createdAt).not.toBeNull()
                    expect(doc.updatedAt).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })

            test("doc0's NestedCollection", async () => {
                try {
                    const docs = await new Document(doc0_nested_id).nestedCollection.get(Document)
                    expect(docs.filter((value) => {
                        return (value.id == child.id)
                    })).toBeTruthy()
                    docs.forEach((doc) => {
                        expect(doc).not.toBeUndefined()
                        expect(doc).not.toBeNull()
                        expect(doc.createdAt).not.toBeNull()
                        expect(doc.updatedAt).not.toBeNull()
                    })
                } catch (error) {
                    console.log(error)
                }
            })

            test("doc1's NestedCollection", async () => {
                try {
                    const docs = await new Document(doc1_nested_id).nestedCollection.get(Document)
                    expect(docs.filter((value) => {
                        return (value.id == child.id)
                    })).toBeTruthy()
                    docs.forEach((doc) => {
                        expect(doc).not.toBeUndefined()
                        expect(doc).not.toBeNull()
                        expect(doc.createdAt).not.toBeNull()
                        expect(doc.updatedAt).not.toBeNull()
                    })
                } catch (error) {
                    console.log(error)
                }
            })

            test("A NestedCollection saved before doc0_nested is saved", async () => {
                try {
                    const doc = await Document.get(doc1_other_nested_id) as Document
                    expect(doc).not.toBeUndefined()
                    expect(doc).not.toBeNull()
                    expect(doc.createdAt).not.toBeNull()
                    expect(doc.updatedAt).not.toBeNull()
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })

            test("A NestedCollection saved before doc0_nested is saved", async () => {
                try {
                    const docs = await new Document(doc0_nested_id).nestedCollection.get(Document)
                    expect(docs.filter((value) => {
                        return (value.id == child.id)
                    })).toBeTruthy()
                    docs.forEach((doc) => {
                        expect(doc).not.toBeUndefined()
                        expect(doc).not.toBeNull()
                        expect(doc.createdAt).not.toBeNull()
                        expect(doc.updatedAt).not.toBeNull()
                    })
                } catch (error) {
                    console.log(error)
                }
            })

            test("Document saved as a child can be get", async () => {
                try {
                    const docs = await new Document(doc0_nested_id).nestedCollection.get(Document)
                    expect(docs.filter((value) => {
                        return (value.id == child.id)
                    })).toBeTruthy()
                    docs.forEach((doc) => {
                        expect(doc).not.toBeUndefined()
                        expect(doc).not.toBeNull()
                        expect(doc.createdAt).not.toBeNull()
                        expect(doc.updatedAt).not.toBeNull()
                    })
                } catch (error) {
                    console.log(error)
                }
            })
        })
    })

    describe("NestedCollection", async () => {
        describe("Get NestedCollection's document", async () => {
            test("Root document", async () => {
                try {
                    const doc = await Document.get(doc0_nested_id) as Document
                    expect(doc).not.toBeUndefined()
                    expect(doc).not.toBeNull()
                    expect(doc.createdAt).not.toBeNull()
                    expect(doc.updatedAt).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })
        })
    })
})
