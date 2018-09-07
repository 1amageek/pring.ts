import * as Pring from "../src/index"
import "reflect-metadata"

const property = Pring.property
const File = Pring.File

export class Document extends Pring.Base {
    @property array: string[]                         = ["array"]
    @property set: object                             = {"set": true}
    @property bool: boolean                           = true
    @property binary: Buffer                          = Buffer.from("data", 'utf8')
    @property file: Pring.File                        = new Pring.File("file.jpg", "https://file", "image/png")
    @property number: number                          = 9223372036854776000
    @property date: Date                              = new Date(100)
    @property dictionary: object                      = {"key": "value"}  
    @property string: string                          = "string"

    @property referenceCollection: Pring.ReferenceCollection<Document> = new Pring.ReferenceCollection(this)
    @property nestedCollection: Pring.NestedCollection<Document> = new Pring.NestedCollection(this)
}

export class DocumentLite extends Pring.Base {
    @property name: string                            = ""
    @property array: string[]                         = ["array"]
    @property set: object                             = {"set": true}
    @property bool: boolean                           = true
    @property file: Pring.File                        = new Pring.File("file.jpg", "https://file", "image/png")
    @property number: number                          = 9223372036854776000
    @property date: Date                              = new Date(100)
    @property dictionary: object                      = {"key": "value"}  
    @property string: string                          = "string"

    @property referenceCollection: Pring.ReferenceCollection<DocumentLite> = new Pring.ReferenceCollection(this)
    @property nestedCollection: Pring.NestedCollection<DocumentLite> = new Pring.NestedCollection(this)
}
