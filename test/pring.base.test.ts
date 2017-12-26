process.env.NODE_ENV = 'test';

import { Pring } from "../pring"
import * as FirebaseFirestore from '@google-cloud/firestore'
import { Document } from './document.test'

Pring.initialize({
    projectId: 'sandbox-329fc',
    keyFilename: './sandbox-329fc-firebase-adminsdk-8kgnw-3a2693f6cb.json'
})

describe("Document property", () => {

    const document = new Document()
    var doc: Document

    beforeAll(async () => {
        await document.save()
        doc = await Document.get(document.id) as Document
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
            console.log("aa", doc.file, document.file)
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
