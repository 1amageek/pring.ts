process.env.NODE_ENV = 'test';

import * as Pring from "../src/index"
import { Document } from './document'

Pring.initialize({
    projectId: 'salada-f825d',
    keyFilename: './salada-f825d-firebase-adminsdk-19k25-ded6604978.json'
})

describe("SubCollection pack", () => {

    // NestedCollection
    const doc0_nested = new Document()
    const doc1_nested = new Document()
    const doc2_nested = new Document()
    const doc1_other_nested = new Document()

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
    });

    describe("NestedCollection", async () => {
        describe("Get NestedCollection's document", async () => {            

            test("Root document", async () => {
                try {
                    const doc: Document = await Document.get(doc0_nested_id, Document)
                    expect(doc).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })
    
            test("doc0's NestedCollection", async () => {
                try {
                    const doc = await new Document(doc0_nested_id).nestedCollection.get(Document)
                    expect(doc[0]).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })
    
            test("doc1's NestedCollection", async () => {
                try {
                    const doc = await new Document(doc1_nested_id).nestedCollection.get(Document)
                    expect(doc[0]).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })
    
            test("A NestedCollection saved before doc0_nested is saved", async () => {
                try {
                    const doc = await Document.get(doc1_other_nested_id, Document)
                    expect(doc).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })

            test("A NestedCollection saved before doc0_nested is saved", async () => {
                try {
                    const doc = await new Document(doc0_nested_id).nestedCollection.get(Document)
                    expect(doc[0]).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })
        })
    })
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
                    const doc = await Document.get(doc0_nested_id, Document)
                    expect(doc).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })
        })
    })
})
