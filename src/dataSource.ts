import { Base, QuerySnapshot, DocumentData, DocumentChange, QueryDocumentSnapshot } from './base'
import { Query } from './query'

export class Option<Element extends typeof Base> {

    public timeout: number = 10

    public sortBlock?: (a: InstanceType<Element>, b: InstanceType<Element>) => number
}

export enum Change {
    initial = 'initial',
    update = 'update',
    error = 'error'
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

export class DataSource<Element extends typeof Base> {

    [index: number]: Element

    public query: Query<Element>

    public option: Option<Element>

    public documents: InstanceType<Element>[] = []

    public changeBlock?: (snapshot: QuerySnapshot, change: CollectionChange) => void

    public errorBlock?: (error: Error) => void

    public completedBlock?: (documents: InstanceType<Element>[]) => void

    private _Element!: Element

    public constructor(query: Query<Element>,
        option: Option<Element> = new Option(),
        type: Element) {
        this.query = query
        this.option = option
        this._Element = type
    }

    public doc(index: number): InstanceType<Element> {
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

    public onCompleted(block: (documents: InstanceType<Element>[]) => void): this {
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

    public async next() {
        const snapshot: QuerySnapshot = await this.query.get()
        const documents: InstanceType<Element>[] = await this._operate(snapshot, false)
        if (snapshot.docs.length > 0) {
            const lastSnapshot = snapshot.docs[snapshot.docs.length - 1]
            this.query = this.query.startAfter(lastSnapshot)
        }
        return documents
    }

    public async get() {
        return this.next()
    }

    private async _operate(snapshot: QuerySnapshot, isFirst: boolean) {
        const documents: InstanceType<Element>[] = []
        const changes: DocumentChange[] = snapshot.docChanges()
        changes.forEach(async change => {
            const id: string = change.doc.id
            switch (change.type) {
                case 'added': {
                    const document: InstanceType<Element> = this._get(change.doc.id, change.doc.data())
                    documents.push(document)
                    documents.sort(this.option.sortBlock)
                    if (this.query.isReference) {
                        await document.fetch()
                    }
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
                    const document: InstanceType<Element> = this._get(change.doc.id, change.doc.data())
                    if (this.query.isReference) {
                        await document.fetch()
                    }
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
        if (this.query.isReference) {
            const promises = documents.map((doc) => {
                return doc.fetch()
            })
            await Promise.all(promises)
        }
        return documents
    }

    private _get(id: string, data: DocumentData) {
        if (this.query.isReference) {
            const document = new this._Element(id, {}) as InstanceType<Element>
            return document
        } else {
            const document = new this._Element(id, data) as InstanceType<Element>
            document.setData(data)
            document.setReference(this.query.reference.doc(id))
            return document
        }
    }
}
