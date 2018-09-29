process.env.NODE_ENV = 'test';
import * as firebase from 'firebase'
import * as Pring from "../src/index"
import { DocumentLite } from './document'
import { config } from "./config"

const app = firebase.initializeApp(config);

Pring.initialize(app.firestore(), firebase.firestore.FieldValue.serverTimestamp())

describe("DocumentLite property", () => {

    describe("properties before get", async () => {

        test("batch", () => {
            expect(Pring.firestore.batch() instanceof firebase.firestore.WriteBatch).toBeTruthy()
        })

        test("String type", async () => {
            const document = new DocumentLite()
            await document.save()
            const doc = await DocumentLite.get(document.id) as DocumentLite
            doc.string = "update"
            await doc.update()
            expect(doc.string).toEqual("update")
            await doc.delete()
        })

        test("Number type", async () => {
            const document = new DocumentLite()
            await document.save()
            const doc = await DocumentLite.get(document.id) as DocumentLite
            doc.number = 100
            await doc.update()
            expect(doc.number).toEqual(100)
            await doc.delete()
        })

        test("Boolean type", async () => {
            const document = new DocumentLite()
            await document.save()
            const doc = await DocumentLite.get(document.id) as DocumentLite
            doc.bool = false
            await doc.update()
            expect(doc.bool).toEqual(false)
            await doc.delete()
        })

        test("Date type", async () => {
            const document = new DocumentLite()
            await document.save()
            const doc = await DocumentLite.get(document.id) as DocumentLite
            doc.date = new Date(1000)
            await doc.update()
            expect(doc.date).toEqual(new Date(1000))
            await doc.delete()
        })

        test("Dicionary type", async () => {
            const document = new DocumentLite()
            await document.save()
            const doc = await DocumentLite.get(document.id) as DocumentLite
            doc.dictionary = { "key": "update" }
            await doc.update()
            expect(doc.dictionary).toEqual({ "key": "update" })
            await doc.delete()
        })

        test("Array type", async () => {
            const document = new DocumentLite()
            await document.save()
            const doc = await DocumentLite.get(document.id) as DocumentLite
            doc.array = ["update"]
            await doc.update()
            expect(doc.array).toEqual(["update"])
            await doc.delete()
        })

        test("Set type", async () => {
            const document = new DocumentLite()
            await document.save()
            const doc = await DocumentLite.get(document.id) as DocumentLite
            doc.set = { "update": true }
            await doc.update()
            expect(doc.set).toEqual({ "update": true })
            await doc.delete()
        })

        test("File type", async () => {
            const document = new DocumentLite()
            await document.save()
            const doc = await DocumentLite.get(document.id) as DocumentLite
            doc.file = new Pring.File("update.jpg", "https://file", "image/png")
            await doc.update()
            expect(doc.file).toEqual(new Pring.File("update.jpg", "https://file", "image/png"))
            await doc.delete()
        })
    })

    describe("properties after get", async () => {

        test("batch", () => {
            expect(Pring.firestore.batch() instanceof firebase.firestore.WriteBatch).toBeTruthy()
        })

        test("String type", async () => {
            const document = new DocumentLite()
            await document.save()
            const doc = await DocumentLite.get(document.id) as DocumentLite
            doc.string = "update"
            await doc.update()
            const newDoc = await DocumentLite.get(document.id) as DocumentLite
            expect(newDoc.string).toEqual("update")
            await newDoc.delete()
        })

        test("Number type", async () => {
            const document = new DocumentLite()
            await document.save()
            const doc = await DocumentLite.get(document.id) as DocumentLite
            doc.number = 100
            await doc.update()
            const newDoc = await DocumentLite.get(document.id) as DocumentLite
            expect(newDoc.number).toEqual(100)
            await newDoc.delete()
        })

        test("Boolean type", async () => {
            const document = new DocumentLite()
            await document.save()
            const doc = await DocumentLite.get(document.id) as DocumentLite
            doc.bool = false
            await doc.update()
            const newDoc = await DocumentLite.get(document.id) as DocumentLite
            expect(newDoc.bool).toEqual(false)
            await newDoc.delete()
        })

        test("Date type", async () => {
            const document = new DocumentLite()
            await document.save()
            const doc = await DocumentLite.get(document.id) as DocumentLite
            doc.date = new Date(1000)
            await doc.update()
            const newDoc = await DocumentLite.get(document.id) as DocumentLite
            expect(newDoc.date).toEqual(new Date(1000))
            await newDoc.delete()
        })

        test("Dicionary type", async () => {
            const document = new DocumentLite()
            await document.save()
            const doc = await DocumentLite.get(document.id) as DocumentLite
            doc.dictionary = { "key": "update" }
            await doc.update()
            const newDoc = await DocumentLite.get(document.id) as DocumentLite
            expect(newDoc.dictionary).toEqual({ "key": "update" })
            await newDoc.delete()
        })

        test("Array type", async () => {
            const document = new DocumentLite()
            await document.save()
            const doc = await DocumentLite.get(document.id) as DocumentLite
            doc.array = ["update"]
            await doc.update()
            const newDoc = await DocumentLite.get(document.id) as DocumentLite
            expect(newDoc.array).toEqual(["update"])
            await newDoc.delete()
        })

        test("Set type", async () => {
            const document = new DocumentLite()
            await document.save()
            const doc = await DocumentLite.get(document.id) as DocumentLite
            doc.set = { "update": true }
            await doc.update()
            const newDoc = await DocumentLite.get(document.id) as DocumentLite
            expect(newDoc.set).toEqual({ "update": true })
            // await newDoc.delete()
        })

        test("File type", async () => {
            const document = new DocumentLite()
            await document.save()
            const doc = await DocumentLite.get(document.id) as DocumentLite
            doc.file = new Pring.File("update.jpg", "https://file", "image/png")
            await doc.update()
            const newDoc = await DocumentLite.get(document.id) as DocumentLite
            expect(newDoc.file).toEqual(new Pring.File("update.jpg", "https://file", "image/png"))
            await newDoc.delete()
        })
    })

    afterAll(() => {
        app.delete()
    })
})
