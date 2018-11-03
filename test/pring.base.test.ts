process.env.NODE_ENV = 'test';
import * as firebase from 'firebase/app'
import * as Pring from "../src/index"
import { config } from "./config"
import { Document } from './document'

const app = firebase.initializeApp(config);

Pring.initialize(app.firestore(), firebase.firestore.FieldValue.serverTimestamp())

describe("Document property", () => {

    const document = new Document()
    var doc: Document

    beforeAll(async () => {
        document.createdAt = new Date(100)
        document.updatedAt = new Date(100)
        await document.save()
        doc = await Document.get(document.id) as Document
    });

    describe("properties", async () => {

        test("batch", () => {
            expect(Pring.firestore.batch() instanceof firebase.firestore.WriteBatch).toBeTruthy()
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
            const doc = await Document.get("not")
            expect(doc).toBeUndefined()
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

    afterAll(() => {
        app.delete()
    })
})
