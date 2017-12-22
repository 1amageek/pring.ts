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
})

describe("Document pack function", () => {

    const doc0 = new Document()
    const doc1 = new Document()
    const doc2 = new Document()
    const doc1_other = new Document()

    const doc0_id = doc0.id
    const doc1_id = doc1.id
    const doc2_id = doc2.id
    const doc1_other_id = doc1_other.id

    beforeAll(async () => {
        await doc1_other.save()
        doc0.referenceCollection.insert(doc1)
        doc0.referenceCollection.insert(doc1_other)
        doc1.referenceCollection.insert(doc2)
        await doc0.save()
    });

    describe("Document get", async () => {

        test("doc 0", async () => {
            try {
                const doc = await Document.get(doc0_id)
                expect(doc).not.toBeNull()
            } catch (error) {
                console.log(error)
            }
        })

        test("doc 1", async () => {
            try {
                const doc = await Document.get(doc1_id)
                expect(doc).not.toBeNull()
            } catch (error) {
                console.log(error)
            }
        })

        test("doc 2", async () => {
            try {
                const doc = await Document.get(doc2_id)
                expect(doc).not.toBeNull()
            } catch (error) {
                console.log(error)
            }
        })

        test("doc 1 other", async () => {
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

                expect(doc).not.toBeNull()
            } catch (error) {
                console.log(error)
            }
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
