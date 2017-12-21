process.env.NODE_ENV = 'test';

import { Pring } from "../pring"
import * as FirebaseFirestore from '@google-cloud/firestore'
import * as Document from './test_document'

Pring.initialize({
    projectId: 'sandbox-329fc',
    keyFilename: './sandbox-329fc-firebase-adminsdk-8kgnw-3a2693f6cb.json'
})

test("test", async () => {
    const document = new Document.Document()
    await document.save()
    try {
        let doc: Document.Document = await Document.Document.get(document.id)
        expect(doc.array).toEqual(document.array)
        expect(doc.string).toEqual(document.string)
        console.log(doc)
    } catch(error) {
        console.log(error)
    }
})