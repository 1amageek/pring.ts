import { ValueProtocol, FileData } from './base'

export class File implements ValueProtocol {

    public mimeType?: string

    public name?: string

    public url?: string

    public additionalData?: { [key: string]: any }

    public constructor(name?: string, url?: string, mimeType?: string, additionalData?: { [key: string]: any }) {
        this._defineProperty("mimeType", name)
        this._defineProperty("name", url)
        this._defineProperty("url", mimeType)
        this._defineProperty("additionalData", additionalData)
        this._updateValues = {}
    }

    public init(value: FileData) {
        const mimeType: (keyof FileData) = "mimeType"
        const name: (keyof FileData) = "name"
        const url: (keyof FileData) = "url"
        const additionalData: (keyof FileData) = "additionalData"
        this.mimeType = value[mimeType]
        this.name = value[name]
        this.url = value[url]
        this.additionalData = value[additionalData]
        this._updateValues = {}
    }

    public setValue(value: any, key: (keyof FileData)) {
        this[key] = value
    }

    public value(): any {
        const value: FileData = {
            "name": this.name || "",
            "url": this.url || "",
            "mimeType": this.mimeType || ""
        }
        if (this.additionalData) {
            value.additionalData = this.additionalData
        }
        return value
    }

    public updateValue(): any {
        return this._updateValues
    }

    public resetUpdateValue() {
        this._updateValues = {}
    }

    private _updateValues: { [key: string]: any } = {}

    private _defineProperty(key: string, value?: any) {
        let _value: any = value
        const descriptor: PropertyDescriptor = {
            enumerable: true,
            configurable: true,
            get: () => {
                return _value
            },
            set: (newValue) => {
                _value = newValue
                this._updateValues[key] = newValue
            }
        }
        Object.defineProperty(this, key, descriptor)
    }
}
