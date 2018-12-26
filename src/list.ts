import { } from 'reflect-metadata'
import * as firebase from 'firebase/app'
import {
    Base,
    AnyList
} from './base'

export class List<Element extends Base> implements AnyList {

    parent?: Base

    key: string = ''

    private _Element: { new(...args: any[]): Element }

    private _storage: { [id: string]: Element } = {}

    private _updateValue: { [key: string]: any } = {}

    public constructor(parent: Base, type: { new(...args: any[]): Element }) {
        this.parent = parent
        this._Element = type
    }

    public value(): { [key: string]: any } {
        let value: { [key: string]: any } = {}
        for (const id in this._storage) {
            value[id] = this._storage[id].rawValue()
        }
        return value
    }

    public updateValue(): { [key: string]: any } {
        let value: { [key: string]: any } = this._updateValue
        for (const id in this._storage) {
            const updateValue = this._storage[id].updateValue()
            if (Object.keys(updateValue).length > 0) {
                value[id] = updateValue
            }
        }
        return value
    }

    public setValue(value: { [key: string]: any }): void {
        const storage: { [id: string]: any } = {}
        for (const id of Object.keys(value)) {
            const data = value[id]
            const element = new this._Element(id, data)
            element.setData(data)
            storage[id] = element
        }
        this._storage = storage
    }

    public setParent(parent: Base, key: string): void {
        this.parent = parent
        this.key = key
    }

    public append(object: Element) {
        this._storage[object.id] = object
        if (this.parent) {
            if (object.isSaved) {
                this._updateValue[object.id] = object
            }
        }
    }

    public remove(object: Element) {
        delete this._storage[object.id]
        if (this.parent) {
            if (object.isSaved) {
                this._updateValue[object.id] = firebase.firestore.FieldValue.delete()
            }
        }
    }

    public objectOf(key: string): Element {
        return this._storage[key]
    }

    public objects(): Element[] {
        const objects: Element[] = []
        for (const id in this._storage) {
            objects.push(this._storage[id])
        }
        return objects
    }

    public clean() {
        this._updateValue = {}
    }

    public count(): number {
        return Object.keys(this._storage).length
    }
}