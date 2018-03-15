process.env.NODE_ENV = 'test';

import * as Pring from "../src/index"
import { Document } from './document'

Pring.initialize({
    projectId: 'salada-f825d',
    keyFilename: './salada-f825d-firebase-adminsdk-19k25-ded6604978.json'
})

describe("SubCollection pack", () => {

    // ReferenceCollection
    const doc0 = new Document()
    const doc1 = new Document()
    const doc2 = new Document()
    const doc1_other = new Document()
    const doc2_other = new Document()

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
        doc1.referenceCollection.insert(doc2)
        doc1.referenceCollection.insert(doc2_other)
        await doc0.save()
        await doc1.update()
    });

    describe("ReferenceCollection", async () => {

        describe("Get ReferenceCollection's document", async () => {

            test("Root document", async () => {
                try {
                    const doc: Document = await Document.get(doc0_id, Document)
                    expect(doc).not.toBeNull()
                    expect(doc0.isSaved).toEqual(true)
                    expect(doc1.isSaved).toEqual(true)
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })
    
            test("doc0's ReferenceCollection", async () => {
                try {
                    const doc = await Document.get(doc1_id, Document)
                    expect(doc).not.toBeNull()
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })
    
            test("doc1's ReferenceCollection", async () => {
                try {
                    const doc = await Document.get(doc2_id, Document)
                    expect(doc).not.toBeNull()
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })
    
            test("A ReferenceCollection saved before doc0 is saved", async () => {
                try {
                    const doc = await Document.get(doc1_other_id, Document)
                    expect(doc).not.toBeNull()
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })

            test("This doc2_other is saved in another ReferenceCollection", async () => {
                try {
                    const doc = await Document.get(doc2_other_id, Document)
                    expect(doc).not.toBeNull()
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
                    expect( docs.filter((value) => {
                        return (value.id == doc1_id)
                    })).toBeTruthy()
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
                    expect( docs.filter((value) => {
                        return (value.id == doc2_id)
                    })).toBeTruthy()
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
                    expect( docs.filter((value) => {
                        return (value.id == doc1_other_id)
                    })).toBeTruthy()
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
                    expect( docs.filter((value) => {
                        return (value.id == doc1_id)
                    })).toBeTruthy()
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })
    
            test("doc 2 reference", async () => {
                try {
                    const docs = await new Document(doc1_id).referenceCollection.get(Document) 
                    expect( docs.filter((value) => {
                        return (value.id == doc2_id)
                    })).toBeTruthy()
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })
    
            test("doc 1 reference before saved document", async () => {
                try {
                    const docs = await new Document(doc0_id).referenceCollection.get(Document) 
                    expect( docs.filter((value) => {
                        return (value.id == doc1_other_id)
                    })).toBeTruthy()
                } catch (error) {
                    expect(error).toBeNull()
                    console.log(error)
                }
            })
        })
    })
})
