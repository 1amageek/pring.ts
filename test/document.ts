import * as Pring from "../src/index"
import "reflect-metadata"
import { firestore } from "firebase";

const property = Pring.property
const File = Pring.File

export class Document extends Pring.Base {
    @property name: string                            = ""
    @property array: string[]                         = ["array"]
    @property set: object                             = {"set": true}
    @property bool: boolean                           = true
    @property file: Pring.File                        = new Pring.File("file.jpg", "https://file", "image/png")
    @property number: number                          = 9223372036854776000
    @property day: Date = new Date(100)
    @property date: firestore.Timestamp                   = firestore.Timestamp.fromDate(new Date(100))
    @property dictionary: object                      = {"key": "value"}  
    @property string: string                          = "string"

    @property referenceCollection: Pring.ReferenceCollection<Document> = new Pring.ReferenceCollection(this)
    @property nestedCollection: Pring.NestedCollection<Document> = new Pring.NestedCollection(this)
}

export class OptionalDocument extends Pring.Base {
    @property array?: string[]
    @property set?: object
    @property bool?: boolean
    @property file?: Pring.File
    @property files?: Pring.File[]
    @property number?: number
    @property date?: firebase.firestore.Timestamp
    @property geoPoint?: firebase.firestore.GeoPoint
    @property dictionary?: object
    @property json?: {[key: string]: any}
    @property string?: String
}
