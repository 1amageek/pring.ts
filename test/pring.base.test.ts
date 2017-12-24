process.env.NODE_ENV = 'test';

import { Pring } from "../pring"
import * as FirebaseFirestore from '@google-cloud/firestore'
import { Document } from './test_document'

Pring.initialize({
    projectId: 'sandbox-329fc',
    keyFilename: './sandbox-329fc-firebase-adminsdk-8kgnw-3a2693f6cb.json'
})

describe("Document property", () => {

    const document = new Document()
    var doc: Document

    beforeAll(async () => {
        await document.save()
        doc = await Document.get(document.id)
    });

    describe("properties", async () => {

        test("String type", () => {
            expect(doc.string).toEqual(document.string)
        })

        test("Number type", () => {
            expect(doc.number).toEqual(document.number)
        })

        test("Boolean type", () => {
            expect(doc.bool).toEqual(document.bool)
        })

        test("Date type", () => {
            expect(doc.date).toEqual(document.date)
        })

        test("GeoPoint type", () => {
            expect(doc.geoPoint).toEqual(document.geoPoint)
        })

        test("Dicionary type", () => {
            expect(doc.dictionary).toEqual(document.dictionary)
        })

        test("Array type", () => {
            expect(doc.array).toEqual(document.array)
        })

        test("Set type", () => {
            expect(doc.set).toEqual(document.set)
        })

        test("File type", () => {
            expect(doc.file).toEqual(document.file)
        })
    })

    describe("delete document", async () => {
        test("delete", async () => {
            try {
                const document_id = doc.id
                await doc.delete()
                await Document.get(document_id)
            } catch (error) {
                expect(error).not.toBeNull()
            }
        })
    })
})

describe("SubCollection pack", () => {

    // ReferenceCollection
    const doc0 = new Document()
    const doc1 = new Document()
    const doc2 = new Document()
    const doc1_other = new Document()

    const doc0_id = doc0.id
    const doc1_id = doc1.id
    const doc2_id = doc2.id
    const doc1_other_id = doc1_other.id

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
        // Reference
        await doc1_other.save()
        doc0.referenceCollection.insert(doc1)
        doc0.referenceCollection.insert(doc1_other)
        doc1.referenceCollection.insert(doc2)
        await doc0.save()

        // Nested
        await doc1_other_nested.save()
        doc0_nested.nestedCollection.insert(doc1_nested)
        doc0_nested.nestedCollection.insert(doc1_other_nested)
        doc1_nested.nestedCollection.insert(doc2_nested)
        await doc0_nested.save()
    });

    describe("ReferenceCollection", async () => {
        describe("Get ReferenceCollection's document", async () => {

            test("Root document", async () => {
                try {
                    const doc = await Document.get(doc0_id)
                    expect(doc).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })
    
            test("doc0's ReferenceCollection", async () => {
                try {
                    const doc = await Document.get(doc1_id)
                    expect(doc).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })
    
            test("doc1's ReferenceCollection", async () => {
                try {
                    const doc = await Document.get(doc2_id)
                    expect(doc).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })
    
            test("A ReferenceCollection saved before doc0 is saved", async () => {
                try {
                    const doc = await Document.get(doc1_other_id)
                    expect(doc).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })
        })
    
        describe("Document get reference", async () => {
            test("doc 1 reference", async () => {
                try {
                    const doc = await Document.get(doc0_id)
                    const docs: FirebaseFirestore.DocumentSnapshot[] = await doc0.referenceCollection.get() 
                    expect( docs.filter((value) => {
                        return (value.id == doc1_id)
                    })).toBeTruthy()
                } catch (error) {
                    console.log(error)
                }
            })
    
            test("doc 2 reference", async () => {
                try {
                    const doc = await Document.get(doc1_id)
                    const docs: FirebaseFirestore.DocumentSnapshot[] = await doc0.referenceCollection.get() 
                    expect( docs.filter((value) => {
                        return (value.id == doc2_id)
                    })).toBeTruthy()
                } catch (error) {
                    console.log(error)
                }
            })
    
            test("doc 1 reference before saved document", async () => {
                try {
                    const doc = await Document.get(doc0_id)
                    const docs: FirebaseFirestore.DocumentSnapshot[] = await doc0.referenceCollection.get() 
                    expect( docs.filter((value) => {
                        return (value.id == doc1_other_id)
                    })).toBeTruthy()
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
                    const doc = await Document.get(doc0_nested_id)
                    expect(doc).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })
    
            test("doc0's ReferenceCollection", async () => {
                try {
                    const doc = new Document(doc0_nested_id)
                    doc.nestedCollection.
                    // const doc = await Document.get(doc1_nested_id)
                    expect(doc).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })
    
            test("doc1's ReferenceCollection", async () => {
                try {
                    const doc = await Document.get(doc2_id)
                    expect(doc).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })
    
            test("A ReferenceCollection saved before doc0 is saved", async () => {
                try {
                    const doc = await Document.get(doc1_other_id)
                    expect(doc).not.toBeNull()
                } catch (error) {
                    console.log(error)
                }
            })
        })
    
        describe("Document get reference", async () => {
            test("doc 1 reference", async () => {
                try {
                    const doc = await Document.get(doc0_id)
                    const docs: FirebaseFirestore.DocumentSnapshot[] = await doc0.referenceCollection.get() 
                    expect( docs.filter((value) => {
                        return (value.id == doc1_id)
                    })).toBeTruthy()
                } catch (error) {
                    console.log(error)
                }
            })
    
            test("doc 2 reference", async () => {
                try {
                    const doc = await Document.get(doc1_id)
                    const docs: FirebaseFirestore.DocumentSnapshot[] = await doc0.referenceCollection.get() 
                    expect( docs.filter((value) => {
                        return (value.id == doc2_id)
                    })).toBeTruthy()
                } catch (error) {
                    console.log(error)
                }
            })
    
            test("doc 1 reference before saved document", async () => {
                try {
                    const doc = await Document.get(doc0_id)
                    const docs: FirebaseFirestore.DocumentSnapshot[] = await doc0.referenceCollection.get() 
                    expect( docs.filter((value) => {
                        return (value.id == doc1_other_id)
                    })).toBeTruthy()
                } catch (error) {
                    console.log(error)
                }
            })
        })
    })


    describe("Document delete", async () => {

        test("doc 0", async () => {
            try {
                const doc = await Document.get(doc0_id)
                await doc.delete()
                await Document.get(doc0_id)
            } catch (error) {
                expect(error).not.toBeNull()
            }
        })

        // test("doc 1", async () => {
        //     try {
        //         const doc = await Document.get(doc1_id)
        //         expect(doc).not.toBeNull()
        //     } catch(error) {
        //         console.log(error)
        //     }
        // })

        // test("doc 2", async () => {
        //     try {
        //         const doc = await Document.get(doc2_id)
        //         expect(doc).not.toBeNull()
        //     } catch(error) {
        //         console.log(error)
        //     }
        // })

        // test("doc 1 other", async () => {
        //     try {
        //         const doc = await Document.get(doc1_other_id)
        //         expect(doc).not.toBeNull()
        //     } catch(error) {
        //         console.log(error)
        //     }
        // })
    })
})
