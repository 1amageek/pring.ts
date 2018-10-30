process.env.NODE_ENV = 'test';
import * as Pring from "../src/index"
import { DocumentLite } from './document'
import * as firebase from 'firebase/app'
import { config } from "./config"

const app = firebase.initializeApp(config);

Pring.initialize(app.firestore(), firebase.firestore.FieldValue.serverTimestamp())

describe("SubCollection pack", () => {

    // NestedCollection
    const doc0_nested = new DocumentLite()
    const doc1_nested = new DocumentLite()
    const doc2_nested = new DocumentLite()
    const doc1_before_saved_nested = new DocumentLite()
    const child = new DocumentLite()

    const doc0_nested_id = doc0_nested.id
    const doc1_nested_id = doc1_nested.id
    const doc2_nested_id = doc2_nested.id
    const doc1_before_saved_nested_id = doc1_before_saved_nested.id

    beforeAll(async () => {
        // Nested
        await doc1_before_saved_nested.save()
        doc0_nested.nestedCollection.insert(doc1_nested)
        doc0_nested.nestedCollection.insert(doc1_before_saved_nested)
        doc1_nested.nestedCollection.insert(doc2_nested)
        await doc0_nested.save()

        child.setParent(doc0_nested.nestedCollection)
        await child.save()
    });

    describe("NestedCollection", async () => {
        describe("Get NestedCollection's document", async () => {

            test("Root document", async () => {
                try {
                    const doc: DocumentLite = await DocumentLite.get(doc0_nested_id) as DocumentLite
                    expect(doc).not.toBeNull()
                    expect(doc.createdAt).not.toBeNull()
                    expect(doc.updatedAt).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })

            test("doc0's NestedCollection", async () => {
                try {
                    const doc = await new DocumentLite(doc0_nested_id).nestedCollection.get(DocumentLite)
                    expect(doc[0]).not.toBeNull()
                    expect(doc[0].createdAt).not.toBeNull()
                    expect(doc[0].updatedAt).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })

            test("doc1's NestedCollection", async () => {
                try {
                    const parent = new DocumentLite(doc0_nested_id, {})
                    const doc = await parent.nestedCollection.get(DocumentLite)
                    expect(doc[0]).not.toBeUndefined()
                    expect(doc[0]).not.toBeNull()
                    expect(doc[0].createdAt).not.toBeNull()
                    expect(doc[0].updatedAt).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })

            test("A NestedCollection saved before doc0_nested is saved", async () => {
                try {
                    const doc = await DocumentLite.get(doc1_before_saved_nested_id) as DocumentLite
                    expect(doc).not.toBeUndefined()
                    expect(doc).not.toBeNull()
                    expect(doc.createdAt).not.toBeNull()
                    expect(doc.updatedAt).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })

            test("A NestedCollection saved before doc0_nested is saved", async () => {
                try {
                    const doc = await new DocumentLite(doc0_nested_id).nestedCollection.get(DocumentLite)
                    expect(doc[0]).not.toBeUndefined()
                    expect(doc[0]).not.toBeNull()
                    expect(doc[0].createdAt).not.toBeNull()
                    expect(doc[0].updatedAt).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })

            test("DocumentLite saved as a child can be get", async () => {
                try {
                    const docs = await new DocumentLite(doc0_nested_id).nestedCollection.get(DocumentLite)
                    expect(docs.filter((value) => {
                        return (value.id == child.id)
                    })).toBeTruthy()
                    expect(docs[0]).not.toBeUndefined()
                    expect(docs[0]).not.toBeNull()
                    expect(docs[0].createdAt).not.toBeNull()
                    expect(docs[0].updatedAt).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })

            test("DocumentLite dataSource get", async () => {
                try {
                    const parent = await new DocumentLite(doc0_nested_id, {})
                    const dataSource = parent.nestedCollection.query(DocumentLite).dataSource()
                    const doc = await dataSource.get()
                    expect(doc[0]).not.toBeUndefined()
                    expect(doc[0]).not.toBeNull()
                    expect(doc[0].createdAt).not.toBeNull()
                    expect(doc[0].updatedAt).not.toBeNull()
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
                    const doc = await DocumentLite.get(doc0_nested_id) as DocumentLite
                    expect(doc).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })
        })
    })

    afterAll(() => {
        app.delete()
    })
})
