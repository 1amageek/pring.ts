process.env.NODE_ENV = 'test';
import * as firebase from 'firebase/app'
import * as Pring from "../src/index"
import { config } from "./config"

const property = Pring.property

const app = firebase.initializeApp(config);

Pring.initialize(app.firestore())

import { OptionalDocument } from './document'

describe("OptionalDocument property", () => {

    describe("properties before get", async () => {

        test("String type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
            doc.string = "update"
            await doc.update()
            expect(doc.string).toEqual("update")
            await doc.delete()
        })

        test("Number type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
            doc.number = 100
            await doc.update()
            expect(doc.number).toEqual(100)
            await doc.delete()
        })

        test("Boolean type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
            doc.bool = false
            await doc.update()
            expect(doc.bool).toEqual(false)
            await doc.delete()
        })

        test("Date type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
            doc.date = firebase.firestore.Timestamp.fromDate(new Date(1000))
            await doc.update()
            expect(doc.date).toEqual(firebase.firestore.Timestamp.fromDate(new Date(1000)))
            await doc.delete()
        })

        test("GeoPoint type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
            doc.geoPoint = new firebase.firestore.GeoPoint(10, 10)
            await doc.update()
            expect(doc.geoPoint).toEqual(new firebase.firestore.GeoPoint(10, 10))
            await doc.delete()
        })

        test("Dicionary type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
            doc.dictionary = { "key": "update" }
            await doc.update()
            expect(doc.dictionary).toEqual({ "key": "update" })
            await doc.delete()
        }, 10000)

        test("Array type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
            doc.array = ["update"]
            await doc.update()
            expect(doc.array).toEqual(["update"])
            await doc.delete()
        }, 10000)

        test("Set type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
            doc.set = { "update": true }
            await doc.update()
            expect(doc.set).toEqual({ "update": true })
            await doc.delete()
        }, 10000)

        test("File type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
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
        }, 10000)
    })

    describe("properties after get", async () => {

        test("String type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
            doc.string = "update"
            await doc.update()
            const newDoc = await OptionalDocument.get(document.id) as OptionalDocument
            expect(newDoc.string).toEqual("update")
            await newDoc.delete()
        }, 10000)

        test("Number type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
            doc.number = 100
            await doc.update()
            const newDoc = await OptionalDocument.get(document.id) as OptionalDocument
            expect(newDoc.number).toEqual(100)
            await newDoc.delete()
        }, 10000)

        test("Boolean type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
            doc.bool = false
            await doc.update()
            const newDoc = await OptionalDocument.get(document.id) as OptionalDocument
            expect(newDoc.bool).toEqual(false)
            await newDoc.delete()
        }, 10000)

        test("Date type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
            doc.date = firebase.firestore.Timestamp.fromDate(new Date(1000))
            await doc.update()
            const newDoc = await OptionalDocument.get(document.id) as OptionalDocument
            expect(newDoc.date).toEqual(firebase.firestore.Timestamp.fromDate(new Date(1000)))
            await newDoc.delete()
        }, 10000)

        test("GeoPoint type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
            doc.geoPoint = new firebase.firestore.GeoPoint(10, 10)
            await doc.update()
            const newDoc = await OptionalDocument.get(document.id) as OptionalDocument
            expect(newDoc.geoPoint).toEqual(new firebase.firestore.GeoPoint(10, 10))
            await newDoc.delete()
        }, 10000)

        test("Dicionary type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
            doc.dictionary = { "key": "update" }
            await doc.update()
            const newDoc = await OptionalDocument.get(document.id) as OptionalDocument
            expect(newDoc.dictionary).toEqual({ "key": "update" })
            await newDoc.delete()
        }, 10000)

        test("Array type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
            doc.array = ["update"]
            await doc.update()
            const newDoc = await OptionalDocument.get(document.id) as OptionalDocument
            expect(newDoc.array).toEqual(["update"])
            await newDoc.delete()
        }, 10000)

        test("Set type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
            doc.set = { "update": true, "set": firebase.firestore.FieldValue.delete() }
            await doc.update()
            const newDoc = await OptionalDocument.get(document.id) as OptionalDocument
            expect(newDoc.set).toEqual({ "update": true })
            await newDoc.delete()
        }, 10000)

        test("File type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
            doc.file = new Pring.File("update.jpg", "https://file", "image/png")
            doc.file.additionalData = {
                "text": "test",
                "number": 0
            }
            await doc.update()
            const newDoc = await OptionalDocument.get(document.id) as OptionalDocument
            const file = newDoc.file as Pring.File
            expect(file.value()).toEqual({
                "additionalData": {"number": 0, "text": "test"}, "name": "update.jpg", "url": "https://file", "mimeType": "image/png"
            })
            expect(file.additionalData).toEqual({
                "text": "test",
                "number": 0
            })
            await newDoc.delete()
        }, 10000)

        test("Files type", async () => {
            const document = new OptionalDocument()
            await document.save()
            const doc = await OptionalDocument.get(document.id) as OptionalDocument
            const files: Pring.File[] = []
            const file0: Pring.File = new Pring.File("update.jpg", "https://file", "image/png")
            file0.additionalData = {
                "text": "test",
                "number": 0
            }
            const file1: Pring.File = new Pring.File("update.jpg", "https://file", "image/png")
            file1.additionalData = {
                "text": "test",
                "number": 0
            }
            files.push(file0)
            files.push(file1)
            doc.files = files
            await doc.update()
            const newDoc = await OptionalDocument.get(document.id) as OptionalDocument
            const newFiles = newDoc.files as Pring.File[]
            expect(newFiles.length).toEqual(2)
            newFiles.forEach( file => {
                expect(file.value()).toEqual({
                    "additionalData": {"number": 0, "text": "test"}, "name": "update.jpg", "url": "https://file", "mimeType": "image/png"
                })
                expect(file.additionalData).toEqual({
                    "text": "test",
                    "number": 0
                })
            })
            await newDoc.delete()
        }, 10000)
    })

    afterAll(() => {
        app.delete()
    })
})
