import { Base, QuerySnapshot, DocumentData, DocumentChange } from './base'
import { Query } from './query'

export class Option<Element extends Base> {

    public timeout: number = 10

    public sortBlock?: (a: Element, b: Element) => number
}

export enum Change {
    initial = "initial",
    update = "update",
    error = "error"
}

export class CollectionChange {

    public type: Change

    public insertions: number[] = []

    public modifications: number[] = []

    public deletions: number[] = []

    constructor(type: Change, insertions: number[], modifications: number[], deletions: number[]) {
        this.type = type
        this.insertions = insertions
        this.modifications = modifications
        this.deletions = deletions
    }
}

export class DataSource<Element extends Base> {

    [index: number]: Element

    public query: Query<Element>

    public option: Option<Element>

    public documents: Element[] = []

    public changeBlock?: (snapshot: QuerySnapshot, change: CollectionChange) => void

    private _Element!: { new(id?: string, data?: DocumentData): Element }

    constructor(query: Query<Element>, option: Option<Element> = new Option(), type: { new(id?: string, data?: DocumentData): Element }) {
        this.query = query
        this.option = option
        this._Element = type
    }

    public doc(index: number): Element {
        return this.documents[index]
    }

    public on(block: (snapshot: QuerySnapshot, change: CollectionChange) => void): this {
        this.changeBlock = block
        return this
    }

    public listen(): this {
        let isFirst: boolean = true
        this.query.listen({
            next: async (snapshot) => {
                if (isFirst) {
                    await this._operate(snapshot, isFirst)
                    isFirst = false
                } else {
                    await this._operate(snapshot, isFirst)
                }
            },
            error: (error) => {

            },
            complete: () => {

            }
        })
        return this
    }

    private async _operate(snapshot: QuerySnapshot, isFirst: boolean) {
        snapshot.docChanges().forEach(async change => {
            const id: string = change.doc.id
            switch (change.type) {
                case 'added': {
                    const document: Element = await this._get(change)
                    this.documents.push(document)
                    this.documents = this.documents.sort(this.option.sortBlock)
                    if (!isFirst) {
                        const IDs: string[] = this.documents.map(doc => doc.id)
                        if (IDs.includes(id)) {
                            const index: number = IDs.indexOf(id)
                            if (this.changeBlock) {
                                const collectionChange: CollectionChange = new CollectionChange(Change.update, [index], [], [])
                                this.changeBlock(snapshot, collectionChange)
                            }
                        }
                    }
                    break
                }
                case 'modified': {
                    const document: Element = await this._get(change)
                    this.documents = this.documents.filter(doc => doc.id !== id)
                    this.documents.push(document)
                    this.documents = this.documents.sort(this.option.sortBlock)
                    const IDs: string[] = this.documents.map(doc => doc.id)
                    if (IDs.includes(id)) {
                        const index: number = IDs.indexOf(id)
                        if (this.changeBlock) {
                            const collectionChange: CollectionChange = new CollectionChange(Change.update, [], [index], [])
                            this.changeBlock(snapshot, collectionChange)
                        }
                    }
                    break
                }
                case 'removed': {
                    this.documents = this.documents.filter(doc => doc.id !== id)
                    this.documents = this.documents.sort(this.option.sortBlock)
                    const IDs: string[] = this.documents.map(doc => doc.id)
                    if (IDs.includes(id)) {
                        const index: number = IDs.indexOf(id)
                        if (this.changeBlock) {
                            const collectionChange: CollectionChange = new CollectionChange(Change.update, [], [], [index])
                            this.changeBlock(snapshot, collectionChange)
                        }
                    }
                    break
                }
            }
        })
        if (isFirst) {
            if (this.changeBlock) {
                const collectionChange: CollectionChange = new CollectionChange(Change.initial, [], [], [])
                this.changeBlock(snapshot, collectionChange)
            }
        }
    }

    private async _get(change: DocumentChange) {
        // private async _get(change: DocumentChange) {
        const id: string = change.doc.id
        if (this.query.isReference) {
            const document: Element = new this._Element(id, {})
            await document.fetch()
            return document
        } else {
            const document: Element = new this._Element(id, change.doc.data())
            return document
        }
    }
}