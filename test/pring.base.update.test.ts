process.env.NODE_ENV = 'test';
import * as firebase from 'firebase/app'
import * as Pring from "../src/index"
import { Document } from './document'
import { config } from "./config"

const app = firebase.initializeApp(config);

Pring.initialize(app.firestore())

describe("Document property", () => {

    describe("properties before get", async () => {

        test("String type", async () => {
            const document = new Document()
            await document.save()
            const doc = await Document.get(document.id) as Document
            doc.string = "update"
            await doc.update()
            expect(doc.string).toEqual("update")
            await doc.delete()
        })

        test("Number type", async () => {
            const document = new Document()
            await document.save()
            const doc = await Document.get(document.id) as Document
            doc.number = 100
            await doc.update()
            expect(doc.number).toEqual(100)
            await doc.delete()
        })

        test("Boolean type", async () => {
            const document = new Document()
            await document.save()
            const doc = await Document.get(document.id) as Document
            doc.bool = false
            await doc.update()
            expect(doc.bool).toEqual(false)
            await doc.delete()
        })

        test("Date type", async () => {
            const document = new Document()
            await document.save()
            const doc = await Document.get(document.id) as Document
            doc.date = firebase.firestore.Timestamp.fromDate(new Date(1000))
            await doc.update()
            expect(doc.date).toEqual(firebase.firestore.Timestamp.fromDate(new Date(1000)))
            await doc.delete()
        })

        test("Dicionary type", async () => {
            const document = new Document()
            await document.save()
            const doc = await Document.get(document.id) as Document
            doc.dictionary = { "key": "update" }
            await doc.update()
            expect(doc.dictionary).toEqual({ "key": "update" })
            await doc.delete()
        })

        test("Array type", async () => {
            const document = new Document()
            await document.save()
            const doc = await Document.get(document.id) as Document
            doc.array = ["update"]
            await doc.update()
            expect(doc.array).toEqual(["update"])
            await doc.delete()
        })

        test("Set type", async () => {
            const document = new Document()
            await document.save()
            const doc = await Document.get(document.id) as Document
            doc.set = { "update": true }
            await doc.update()
            expect(doc.set).toEqual({ "update": true })
            await doc.delete()
        })

        test("File type", async () => {
            const document = new Document()
            await document.save()
            const doc = await Document.get(document.id) as Document
            doc.file = new Pring.File("update.jpg", "https://file", "image/png")
            doc.file.additionalData = {
                "text": "test",
                "number": 0
            }
            await doc.update()
            expect(doc.file.value()).toEqual({
                "additionalData": {"number": 0, "text": "test"}, "name": "update.jpg", "url": "https://file", "mimeType": "image/png"
            })
            expect(doc.file.additionalData).toEqual({
                "text": "test",
                "number": 0
            })
            await doc.delete()
        })
    })

    describe("properties after get", async () => {

        test("batch", () => {
            expect(Pring.firestore.batch() instanceof firebase.firestore.WriteBatch).toBeTruthy()
        })

        test("String type", async () => {
            const document = new Document()
            await document.save()
            const doc = await Document.get(document.id) as Document
            doc.string = "update"
            await doc.update()
            const newDoc = await Document.get(document.id) as Document
            expect(newDoc.string).toEqual("update")
            await newDoc.delete()
        })

        test("Number type", async () => {
            const document = new Document()
            await document.save()
            const doc = await Document.get(document.id) as Document
            doc.number = 100
            await doc.update()
            const newDoc = await Document.get(document.id) as Document
            expect(newDoc.number).toEqual(100)
            await newDoc.delete()
        })

        test("Boolean type", async () => {
            const document = new Document()
            await document.save()
            const doc = await Document.get(document.id) as Document
            doc.bool = false
            await doc.update()
            const newDoc = await Document.get(document.id) as Document
            expect(newDoc.bool).toEqual(false)
            await newDoc.delete()
        })

        test("Date type", async () => {
            const document = new Document()
            await document.save()
            const doc = await Document.get(document.id) as Document
            doc.date = firebase.firestore.Timestamp.fromDate(new Date(1000))
            await doc.update()
            const newDoc = await Document.get(document.id) as Document
            expect(newDoc.date).toEqual(firebase.firestore.Timestamp.fromDate(new Date(1000)))
            await newDoc.delete()
        })

        test("Dicionary type", async () => {
            const document = new Document()
            await document.save()
            const doc = await Document.get(document.id) as Document
            doc.dictionary = { "key": "update" }
            await doc.update()
            const newDoc = await Document.get(document.id) as Document
            expect(newDoc.dictionary).toEqual({ "key": "update" })
            await newDoc.delete()
        })

        test("Array type", async () => {
            const document = new Document()
            await document.save()
            const doc = await Document.get(document.id) as Document
            doc.array = ["update"]
            await doc.update()
            const newDoc = await Document.get(document.id) as Document
            expect(newDoc.array).toEqual(["update"])
            await newDoc.delete()
        })

        test("Set type", async () => {
            const document = new Document()
            await document.save()
            const doc = await Document.get(document.id) as Document
            doc.set = { "update": true }
            await doc.update()
            expect(doc.set).toEqual({ "update": true })
            await doc.delete()
        }, 10000)

        test("File type", async () => {
            const document = new Document()
            await document.save()
            const doc = await Document.get(document.id) as Document
            doc.file = new Pring.File("update.jpg", "https://file", "image/png")
            doc.file.additionalData = {
                "text": "test",
                "number": 0
            }
            await doc.update()
            const newDoc = await Document.get(document.id) as Document
            
            expect(doc.file.value()).toEqual({
                "additionalData": {"number": 0, "text": "test"}, "name": "update.jpg", "url": "https://file", "mimeType": "image/png"
            })
            expect(doc.file.additionalData).toEqual({
                "text": "test",
                "number": 0
            })
            await newDoc.delete()
        })
    })

    afterAll(() => {
        app.delete()
    })
})
