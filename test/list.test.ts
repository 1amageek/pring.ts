process.env.NODE_ENV = 'test';
import * as firebase from 'firebase/app'
import * as Pring from "../src/index"
import { config } from "./config"

const property = Pring.property

const app = firebase.initializeApp(config);

Pring.initialize(app.firestore())
 
class Doc1 extends Pring.Base {
    @property name?: string
    @property age: number = 0
    @property date: firebase.firestore.Timestamp = firebase.firestore.Timestamp.fromDate(new Date(100))
}

class Doc0 extends Pring.Base {
    @property list: Pring.List<Doc1> = new Pring.List(this, Doc1)
}

describe("List Test", () => {

    describe("Test", async () => {

        test("Append", async () => {
            const doc0 = new Doc0()
            const doc1 = new Doc1()
            doc1.name = "doc1"
            doc0.list.append(doc1)
            expect(doc0.list.objectOf(doc1.id).name).toEqual("doc1")
        })

        test("Save Update Delete", async () => {
            const doc0 = new Doc0()
            const doc1 = new Doc1()
            doc1.name = "doc1"
            doc0.list.append(doc1)
            expect(doc0.list.count()).toEqual(1)
            await doc0.save()
            
            {
                const doc: Doc0 = await Doc0.get(doc0.id) as Doc0
                const testDoc = doc.list.objectOf(doc1.id)
                expect(testDoc.name).toEqual("doc1")
                testDoc.name = "update"
                await doc.update()
            }
            {
                const doc: Doc0 = await Doc0.get(doc0.id) as Doc0
                const testDoc = doc.list.objectOf(doc1.id)
                expect(testDoc.name).toEqual("update")
                expect(doc.list.count()).toEqual(1)
                doc.list.remove(testDoc)
                expect(doc.list.count()).toEqual(0)
                await doc.update()
            }
            {
                const doc: Doc0 = await Doc0.get(doc0.id) as Doc0
                expect(doc.list.count()).toEqual(0)
            }
        })
    })
})
