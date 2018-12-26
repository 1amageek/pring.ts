process.env.NODE_ENV = 'test';
import * as firebase from 'firebase/app'
import * as Pring from "../src/index"
import { config } from "./config"

const property = Pring.property

const app = firebase.initializeApp(config);

Pring.initialize(app.firestore())

export class Doc0 extends Pring.Base {
    @property name: string = "doc0"
    @property nest: Pring.NestedCollection<Doc1> = new Pring.NestedCollection(this)
}

export class Doc1 extends Pring.Base {
    @property name: string = "doc1"
    @property nest: Pring.NestedCollection<Doc2> = new Pring.NestedCollection(this)
}

export class Doc2 extends Pring.Base {
    @property name: string = "doc2"
    @property nest: Pring.NestedCollection<Doc3> = new Pring.NestedCollection(this)
}

export class Doc3 extends Pring.Base {
    @property name: string = "doc3"
}


describe("Nest", () => {
    describe("Path", async () => {
        test("Doc0", () => {
            const doc0: Doc0 = new Doc0()
            const doc1: Doc1 = doc0.nest.doc("doc1", Doc1)
            expect(doc1.reference.path).toEqual(`version/1/doc0/${doc0.id}/nest/doc1`)
        })
        test("Doc1", () => {
            const doc0: Doc0 = new Doc0()
            const doc2: Doc2 = doc0.nest.doc("doc1", Doc1).nest.doc("doc2", Doc2)
            expect(doc2.reference.path).toEqual(`version/1/doc0/${doc0.id}/nest/doc1/nest/doc2`)
        })
        test("Doc2", () => {
            const doc0: Doc0 = new Doc0()
            const doc3: Doc3 = doc0.nest.doc("doc1", Doc1).nest.doc("doc2", Doc2).nest.doc("doc3", Doc3)
            expect(doc3.reference.path).toEqual(`version/1/doc0/${doc0.id}/nest/doc1/nest/doc2/nest/doc3`)
        })
    })

    describe("Get", async () => {

        const doc0: Doc0 = new Doc0()
        const doc1: Doc1 = new Doc1()
        const doc2: Doc2 = new Doc2()
        const doc3: Doc3 = new Doc3()

        beforeAll(async () => {
            doc0.nest.insert(doc1)
            doc1.nest.insert(doc2)
            doc2.nest.insert(doc3)
            await doc0.save()
        });

        test("Nested Document Path", async () => {
            const documents = await doc0.nest.query(Doc1).dataSource().get()
            const doc: Doc1 = documents[0]
            expect(doc.reference.path).toEqual(`version/1/doc0/${doc0.id}/nest/${doc1.id}`)
        })

        test("Nested Document Path", async () => {
            const documents = await doc1.nest.query(Doc2).dataSource().get()
            const doc: Doc2 = documents[0]
            expect(doc.reference.path).toEqual(`version/1/doc0/${doc0.id}/nest/${doc1.id}/nest/${doc2.id}`)
        })

        test("Nested Document Path", async () => {
            const documents = await doc2.nest.query(Doc3).dataSource().get()
            const doc: Doc3 = documents[0]
            expect(doc.reference.path).toEqual(`version/1/doc0/${doc0.id}/nest/${doc1.id}/nest/${doc2.id}/nest/${doc3.id}`)
        })
    })
})
