import * as FirebaseFirestore from '@google-cloud/firestore'
import { Base, QuerySnapshot, DocumentData, DocumentChange, QueryDocumentSnapshot } from './base'
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

    public errorBlock?: (error: Error) => void

    public completedBlock?: (documents: Element[]) => void

    private _Element!: { new(id?: string, data?: DocumentData): Element }

    public constructor(query: Query<Element>,
        option: Option<Element> = new Option(),
        type: { new(id?: string, data?: DocumentData): Element }) {
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

    public onError(block: (error: Error) => void): this {
        this.errorBlock = block
        return this
    }

    public onCompleted(block: (documents: Element[]) => void): this {
        this.completedBlock = block
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
                if (this.errorBlock) {
                    this.errorBlock(error)
                }
            },
            complete: () => {
                if (this.completedBlock) {
                    this.completedBlock(this.documents)
                }
            }
        })
        return this
    }

    public async get() {
        const snapshot: QuerySnapshot = await this.query.get()
        const docs: QueryDocumentSnapshot[] = snapshot.docs
        const promises = docs.map(async doc => {
            return await this._get(doc.id, doc.data())
        })
        return Promise.all(promises)
    }

    private async _operate(snapshot: QuerySnapshot, isFirst: boolean) {
        let changes: DocumentChange[] = []
        if (snapshot instanceof FirebaseFirestore.QuerySnapshot) {
            changes = snapshot.docChanges
        } else {
            changes = snapshot.docChanges()
        }
        changes.forEach(async change => {
            const id: string = change.doc.id
            switch (change.type) {
                case 'added': {
                    const document: Element = await this._get(change.doc.id, change.doc.data())
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
                    const document: Element = await this._get(change.doc.id, change.doc.data())
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

    private async _get(id: string, data: DocumentData) {
        if (this.query.isReference) {
            const document: Element = new this._Element(id, {})
            await document.fetch()
            return document
        } else {
            const document: Element = new this._Element(id, data)
            return document
        }
    }
}
