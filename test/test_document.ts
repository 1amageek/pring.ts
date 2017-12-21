import { Pring } from "../pring"
import * as FirebaseFirestore from '@google-cloud/firestore'

export class Document extends Pring.Base {
    array: string[]                         = ["array"]
    // set: object[]                           = []
    // bool: boolean                           = true
    // binary: Buffer                          = Buffer.from("data", 'utf8')
    // file?: object
    // url: URL                                = new URL("https://firebase.google.com/")
    // number: number                          = Number.MAX_VALUE
    // date: Date                              = new Date(100)
    // geoPoint: FirebaseFirestore.GeoPoint    = new FirebaseFirestore.GeoPoint(0, 0)
    // dictionary: object                      = {"key": "value"}  
    string: String                          = "string"
}