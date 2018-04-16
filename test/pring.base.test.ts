process.env.NODE_ENV = 'test';
import * as admin from 'firebase-admin'
import * as FirebaseFirestore from '@google-cloud/firestore'
import * as Pring from "../src/index"
import { Document } from './document'

Pring.initialize(admin.initializeApp({
    projectId: 'salada-f825d',
    keyFilename: './salada-f825d-firebase-adminsdk-19k25-ded6604978.json'
}))

describe("Document property", () => {

    const document = new Document()
    var doc: Document

    beforeAll(async () => {
        document.createdAt = new Date(100)
        document.updatedAt = new Date(100)
        await document.save()
        doc = await Document.get(document.id, Document)
    });

    describe("properties", async () => {

        test("batch", () => {
            expect(Pring.firestore.batch() instanceof FirebaseFirestore.WriteBatch).toBeTruthy()
        })

        test("createdAt", () => {
            expect(doc.createdAt).toEqual(new Date(100))
        })

        test("updatedAt", () => {
            expect(doc.updatedAt).toEqual(new Date(100))
        })

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

    describe("Documents that do not exist", async () => {
        test("not exist", async () => {
            const doc = await Document.get("not", Document)
            expect(doc).toBeUndefined()
        })
    })

    describe("delete document", async () => {
        test("delete", async () => {
            try {
                const document_id = doc.id
                await doc.delete()
                await Document.get(document_id, Document)
            } catch (error) {
                expect(error).not.toBeNull()
            }
        })
    })
})
