import { ValueProtocol } from './base'

export class File implements ValueProtocol {

    mimeType: string

    name: string

    url: string

    constructor(name?: string, url?: string, mimeType?: string) {
        this.name = name
        this.url = url
        this.mimeType = mimeType
    }

    init(value: object) {
        this.mimeType = value["mimeType"]
        this.name = value["name"]
        this.url = value["url"]
    }

    setValue(value: any, key: string) {
        this[key] = value
    }

    value(): any {
        return {
            "name": this.name || "",
            "url": this.url || "",
            "mimeType": this.mimeType || ""
        }
    }
}