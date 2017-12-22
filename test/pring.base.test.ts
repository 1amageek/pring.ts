process.env.NODE_ENV = 'test';

import { Pring } from "../pring"
import * as FirebaseFirestore from '@google-cloud/firestore'
import * as Document from './test_document'

Pring.initialize({
    projectId: 'sandbox-329fc',
    keyFilename: './sandbox-329fc-firebase-adminsdk-8kgnw-3a2693f6cb.json'
})

// test("The document can get some type", async () => {
//     const document = new Document.Document()
//     try {
//         await document.save()
//         let doc: Document.Document = await Document.Document.get(document.id)
//         expect(doc.string).toEqual(document.string)
//         expect(doc.number).toEqual(document.number)
//         expect(doc.number).toEqual(document.string)
//         expect(doc.number).toEqual(document.number)
//         expect(doc.number).toEqual(document.number)
//         expect(doc.number).toEqual(document.number)
//     } catch(error) {

//     }

// })
describe("Document property", () => {

    const document = new Document.Document()
    var doc: Document.Document
    console.log("describe 1")

    beforeAll(async () => {
        await document.save()
        doc = await Document.Document.get(document.id)
        console.log("beforeAll 1")
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

        // test("File type", () => {
        //     expect(doc.file).toEqual(document.file)
        // })

        // test("Set type", () => {
        //     expect(doc.set).toEqual(document.set)
        // })
    })
})



// test("", async () => {
//     const document = new Document.Document()
//     try {
//         await document.save()
//         expect((1 + 2)).toBe(3);
//     } catch(error) {

//     }

//     describe("aa", () => {
//         it("ww", () => {
//             expect((1 + 2)).toBe(3);
//         })
//     })

// })



// describe("The document can get some type", async () => {
//     const document = new Document.Document()
//     try {
//         await document.save()
//         let doc: Document.Document = await Document.Document.get(document.id)

//         test("String type", () => {
//             expect(doc.string).toEqual(document.string)
//         })

//         // test("Number type", () => {
//         //     expect(doc.array).toEqual(document.array)
//         // })

//         // test("Boolean type", () => {
//         //     expect(doc.bool).toEqual(document.bool)
//         // })

//         // test("Number type", () => {
//         //     expect(doc.array).toEqual(document.array)
//         // })

//         // test("Number type", () => {
//         //     expect(doc.array).toEqual(document.array)
//         // })

//         // test("Number type", () => {
//         //     expect(doc.array).toEqual(document.array)
//         // })


//         console.log(doc)
//     } catch(error) {
//         console.log(error)
//     }
// })