process.env.NODE_ENV = 'test';
import * as Pring from "../src/index"
import * as firebase from 'firebase/app'
import { Document } from './document'
import { config } from "./config"

const app = firebase.initializeApp(config);

Pring.initialize(app.firestore(), firebase.firestore.FieldValue.serverTimestamp())

describe("SubCollection pack", () => {

    // ReferenceCollection
    const doc0 = new Document()
    const doc1 = new Document()
    const doc2 = new Document()
    const doc1_other = new Document()
    const doc2_other = new Document()

    doc0.name = "doc0"
    doc1.name = "doc1"
    doc2.name = "doc2"
    doc1_other.name = "doc1_other"
    doc2_other.name = "doc2_other"

    const doc0_id = doc0.id
    const doc1_id = doc1.id
    const doc2_id = doc2.id
    const doc1_other_id = doc1_other.id
    const doc2_other_id = doc2_other.id

    beforeAll(async () => {
        // Reference
        await doc1_other.save()
        doc0.referenceCollection.insert(doc1)
        doc0.referenceCollection.insert(doc1_other)
        doc0.referenceCollection.insert(doc2_other)
        await doc0.save()

        doc1.referenceCollection.insert(doc2)
        doc1.referenceCollection.insert(doc2_other)
        await doc1.update()
    });

    describe("ReferenceCollection", async () => {

        describe("Get ReferenceCollection's document", async () => {

            test("Root document", async () => {
                try {
                    const doc: Document = await Document.get(doc0_id) as Document
                    expect(doc).not.toBeNull()
                    expect(doc0.isSaved).toEqual(true)
                    expect(doc1.isSaved).toEqual(true)
                    expect(doc).not.toBeUndefined()
                    expect(doc.createdAt).not.toBeNull()
                    expect(doc.updatedAt).not.toBeNull()
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })

            test("doc0's ReferenceCollection", async () => {
                try {
                    const doc = await Document.get(doc1_id) as Document
                    expect(doc).not.toBeUndefined()
                    expect(doc).not.toBeNull()
                    expect(doc.createdAt).not.toBeNull()
                    expect(doc.updatedAt).not.toBeNull()
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })

            test("doc1's ReferenceCollection", async () => {
                try {
                    const doc = await Document.get(doc2_id) as Document
                    expect(doc).not.toBeUndefined()
                    expect(doc).not.toBeNull()
                    expect(doc.createdAt).not.toBeNull()
                    expect(doc.updatedAt).not.toBeNull()
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })

            test("A ReferenceCollection saved before doc0 is saved", async () => {
                try {
                    const doc = await Document.get(doc1_other_id) as Document
                    expect(doc).not.toBeUndefined()
                    expect(doc).not.toBeNull()
                    expect(doc.createdAt).not.toBeNull()
                    expect(doc.updatedAt).not.toBeNull()
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })

            test("This doc2_other is saved in another ReferenceCollection", async () => {
                try {
                    const doc = await Document.get(doc2_other_id) as Document
                    expect(doc).not.toBeUndefined()
                    expect(doc).not.toBeNull()
                    expect(doc.createdAt).not.toBeNull()
                    expect(doc.updatedAt).not.toBeNull()
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })
        })

        describe("Document get reference", async () => {
            test("doc 1 reference", async () => {
                try {
                    const docs = await new Document(doc0_id).referenceCollection.get(Document)
                    for (const doc of docs) {
                        await doc.fetch()
                    }
                    expect(docs.length !== 0).toBeTruthy()
                    expect(docs.filter((value) => {
                        return (value.id == doc1_id)
                    })).toBeTruthy()
                    docs.forEach((doc) => {
                        expect(doc).not.toBeUndefined()
                        expect(doc).not.toBeNull()
                        expect(doc.createdAt).not.toBeNull()
                        expect(doc.updatedAt).not.toBeNull()
                    })
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })

            test("doc 2 reference", async () => {
                try {
                    const docs = await new Document(doc1_id).referenceCollection.get(Document)
                    for (const doc of docs) {
                        await doc.fetch()
                    }
                    expect(docs.length !== 0).toBeTruthy()
                    expect(docs.filter((value) => {
                        return (value.id == doc2_id)
                    })).toBeTruthy()
                    docs.forEach((doc) => {
                        expect(doc).not.toBeUndefined()
                        expect(doc).not.toBeNull()
                        expect(doc.createdAt).not.toBeNull()
                        expect(doc.updatedAt).not.toBeNull()
                    })
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })

            test("doc 1 reference before saved document", async () => {
                try {
                    const docs = await new Document(doc0_id).referenceCollection.get(Document)
                    for (const doc of docs) {
                        await doc.fetch()
                    }
                    expect(docs.length !== 0).toBeTruthy()
                    expect(docs.filter((value) => {
                        return (value.id == doc1_other_id)
                    })).toBeTruthy()
                    docs.forEach((doc) => {
                        expect(doc).not.toBeUndefined()
                        expect(doc).not.toBeNull()
                        expect(doc.createdAt).not.toBeNull()
                        expect(doc.updatedAt).not.toBeNull()
                    })
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })
        })

        describe("Initilizeed Document get reference", async () => {
            test("doc 1 reference", async () => {
                try {
                    const docs = await new Document(doc0_id).referenceCollection.get(Document)
                    expect(docs.length !== 0).toBeTruthy()
                    expect(docs.filter((value) => {
                        return (value.id == doc1_id)
                    })).toBeTruthy()
                    docs.forEach((doc) => {
                        expect(doc).not.toBeUndefined()
                        expect(doc).not.toBeNull()
                        expect(doc.createdAt).not.toBeNull()
                        expect(doc.updatedAt).not.toBeNull()
                    })
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })

            test("doc 2 reference", async () => {
                try {
                    const docs = await new Document(doc1_id).referenceCollection.get(Document)
                    expect(docs.length !== 0).toBeTruthy()
                    expect(docs.filter((value) => {
                        return (value.id == doc2_id)
                    })).toBeTruthy()
                    docs.forEach((doc) => {
                        expect(doc).not.toBeUndefined()
                        expect(doc).not.toBeNull()
                        expect(doc.createdAt).not.toBeNull()
                        expect(doc.updatedAt).not.toBeNull()
                    })
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })

            test("doc 1 reference before saved document", async () => {
                try {
                    const docs = await new Document(doc0_id).referenceCollection.get(Document)
                    expect(docs.length !== 0).toBeTruthy()
                    expect(docs.filter((value) => {
                        return (value.id == doc1_other_id)
                    })).toBeTruthy()
                    docs.forEach((doc) => {
                        expect(doc).not.toBeUndefined()
                        expect(doc).not.toBeNull()
                        expect(doc.createdAt).not.toBeNull()
                        expect(doc.updatedAt).not.toBeNull()
                    })
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })
        })

        describe("Document get reference", async () => {
            test("doc 1 reference", async () => {
                try {
                    const doc = await Document.get(doc0_id) as Document
                    const docs = await doc.referenceCollection.get(Document)
                    expect(docs.length === 3).toBeTruthy()
                    expect(docs.filter((value) => {
                        return (value.id == doc1_id)
                    })).toBeTruthy()
                    docs.forEach((doc) => {
                        expect(doc).not.toBeUndefined()
                        expect(doc).not.toBeNull()
                        expect(doc.createdAt).not.toBeNull()
                        expect(doc.updatedAt).not.toBeNull()
                    })
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })

            test("doc 2 reference", async () => {
                try {
                    const doc = await Document.get(doc1_id) as Document
                    const docs = await doc.referenceCollection.get(Document)
                    expect(docs.length !== 0).toBeTruthy()
                    expect(docs.filter((value) => {
                        return (value.id == doc2_id)
                    })).toBeTruthy()
                    docs.forEach((doc) => {
                        expect(doc).not.toBeUndefined()
                        expect(doc).not.toBeNull()
                        expect(doc.createdAt).not.toBeNull()
                        expect(doc.updatedAt).not.toBeNull()
                    })
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })

            test("doc 1 reference before saved document", async () => {
                try {
                    const doc = await Document.get(doc0_id) as Document
                    const docs = await doc.referenceCollection.get(Document)
                    expect(docs.length !== 0).toBeTruthy()
                    expect(docs.filter((value) => {
                        return (value.id == doc1_other_id)
                    })).toBeTruthy()
                    docs.forEach((doc) => {
                        expect(doc).not.toBeUndefined()
                        expect(doc).not.toBeNull()
                        expect(doc.createdAt).not.toBeNull()
                        expect(doc.updatedAt).not.toBeNull()
                    })
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })
        })

        describe("DataSource", async () => {
            test("Document dataSource get", async () => {
                try {
                    const parent = await new Document(doc0_id, {})
                    const dataSource = parent.referenceCollection.query(Document).dataSource()
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

    afterAll(() => {
        app.delete()
    })
})
