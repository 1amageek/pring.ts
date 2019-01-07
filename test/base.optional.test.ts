process.env.NODE_ENV = 'test';
import * as firebase from 'firebase/app'
import * as Pring from "../src/index"
import { config } from "./config"

const property = Pring.property

const app = firebase.initializeApp(config);

Pring.initialize(app.firestore())

import { OptionalDocument } from './document'

describe("Document property", () => {

    const document: OptionalDocument = new OptionalDocument()
    var doc: OptionalDocument
    beforeAll(async () => {

        const files: Pring.File[] = []
        const file0: Pring.File = new Pring.File("file.jpg", "https://file", "image/png")
        const file1: Pring.File = new Pring.File("file.jpg", "https://file", "image/png")
        files.push(file0)
        files.push(file1)

        document.array = ["array"]
        document.set = { "set": true }
        document.bool = true
        document.file = new Pring.File("file.jpg", "https://file", "image/png")
        document.files = files
        document.number = 9223372036854776000
        document.date = firebase.firestore.Timestamp.fromDate(new Date(100))
        document.geoPoint = new firebase.firestore.GeoPoint(0, 0)
        document.dictionary = { "key": "value" }
        document.json = { json: { text: "text", number: 0 } }
        document.string = "string"
        document.createdAt = firebase.firestore.Timestamp.fromDate(new Date(100))
        document.updatedAt = firebase.firestore.Timestamp.fromDate(new Date(100))
        await document.save()
        doc = await OptionalDocument.get(document.id) as OptionalDocument
    });

    describe("properties", async () => {
        test("value", () => {
            const keys = Object.keys(doc.value())
            expect(keys.includes("createdAt")).toEqual(true)
            expect(keys.includes("updatedAt")).toEqual(true)
        })

        test("createdAt", () => {
            expect(doc.createdAt).toEqual(firebase.firestore.Timestamp.fromDate(new Date(100)))
        })

        test("updatedAt", () => {
            expect(doc.updatedAt).toEqual(firebase.firestore.Timestamp.fromDate(new Date(100)))
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

        test("JSON type", () => {
            expect(doc.json).toEqual(document.json)
        })

        test("Array type", () => {
            expect(doc.array).toEqual(document.array)
        })

        test("Set type", () => {
            expect(doc.set).toEqual(document.set)
        })

        test("File type", () => {
            const file: Pring.File = doc.file as Pring.File
            expect(file).not.toBeNull()
            expect(file.value()).toEqual({
                "name": "file.jpg",
                "url": "https://file",
                "mimeType": "image/png"
              })
        })

        test("Files type", () => {
            const files: Pring.File[] = doc.files as Pring.File[]
            expect(files.length).toEqual(2)
            files.forEach(file => {
                expect(file.value()).toEqual({
                    "name": "file.jpg",
                    "url": "https://file",
                    "mimeType": "image/png",
                  })
            })
        })
    })

    describe("Documents that do not exist", async () => {
        test("not exist", async () => {
            const doc = await OptionalDocument.get("not")
            expect(doc).toBeUndefined()
        })
    })

    describe("delete document", async () => {
        test("delete", async () => {
            try {
                const document_id = doc.id
                await doc.delete()
                await OptionalDocument.get(document_id)
            } catch (error) {
                expect(error).not.toBeNull()
            }
        })
    })

    afterAll(() => {
        app.delete()
    })
})
