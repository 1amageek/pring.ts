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
    const doc1_other_nested = new DocumentLite()
    const child = new DocumentLite()

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
                    const doc: DocumentLite = await DocumentLite.get(doc0_nested_id) as DocumentLite
                    expect(doc).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })

            test("doc0's NestedCollection", async () => {
                try {
                    const doc = await new DocumentLite(doc0_nested_id).nestedCollection.get(DocumentLite)
                    expect(doc[0]).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })

            test("doc1's NestedCollection", async () => {
                try {
                    const doc = await new DocumentLite(doc1_nested_id).nestedCollection.get(DocumentLite)
                    expect(doc[0]).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })

            test("A NestedCollection saved before doc0_nested is saved", async () => {
                try {
                    const doc = await DocumentLite.get(doc1_other_nested_id) as DocumentLite
                    expect(doc).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })

            test("A NestedCollection saved before doc0_nested is saved", async () => {
                try {
                    const doc = await new DocumentLite(doc0_nested_id).nestedCollection.get(DocumentLite)
                    expect(doc[0]).not.toBeNull()
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
                    expect(docs[0]).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })

            test("DocumentLite dataSource get", async () => {
                try {
                    const doc = await new DocumentLite(doc0_nested_id, {})
                    const dataSource = doc.nestedCollection.query(DocumentLite).dataSource()
                    dataSource.on((snapshot, changes) => {

                        switch (changes.type) {
                            case "initial": {
                                console.log(dataSource.documents)
                                break
                            }
                            case "update": {
                                console.log("insert", changes.insertions)
                                console.log("change", changes.modifications)
                                console.log("delete", changes.deletions)
                                break
                            }
                            case "error": {
                                break
                            }
                        }
                    })
                    const a = await dataSource.get()
                    console.log(a[0].value())
                } catch (error) {
                    console.log(error)
                }
            })
        })
    })
    //     describe("DocumentLite delete", async () => {

    //         test("doc 0", async () => {
    //             try {
    //                 const doc = await DocumentLite.get(doc0_id)
    //                 await doc.delete()
    //                 await DocumentLite.get(doc0_id)
    //             } catch (error) {
    //                 expect(error).not.toBeNull()
    //             }
    //         })

    //         test("doc 1", async () => {
    //             try {
    //                 const doc = await DocumentLite.get(doc1_id)
    //                 expect(doc).not.toBeNull()
    //             } catch(error) {
    //                 console.log(error)
    //             }
    //         })

    //         test("doc 2", async () => {
    //             try {
    //                 const doc = await DocumentLite.get(doc2_id)
    //                 expect(doc).not.toBeNull()
    //             } catch(error) {
    //                 console.log(error)
    //             }
    //         })

    //         test("doc 1 other", async () => {
    //             try {
    //                 const doc = await DocumentLite.get(doc1_other_id)
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
