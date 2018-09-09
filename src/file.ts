import { ValueProtocol, FileData } from './base'

export class File implements ValueProtocol {

    public mimeType?: string

    public name?: string

    public url?: string

    public constructor(name?: string, url?: string, mimeType?: string) {
        this.name = name
        this.url = url
        this.mimeType = mimeType
    }

    public init(value: FileData) {
        const mimeType: (keyof FileData) = "mimeType"
        const name: (keyof FileData) = "name"
        const url: (keyof FileData) = "url"
        this.mimeType = value[mimeType]
        this.name = value[name]
        this.url = value[url]
    }

    public setValue(value: any, key: (keyof FileData)) {
        this[key] = value
    }

    public value(): any {
        return {
            "name": this.name || "",
            "url": this.url || "",
            "mimeType": this.mimeType || ""
        }
    }
}
