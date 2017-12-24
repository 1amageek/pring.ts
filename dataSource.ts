import * as FirebaseFirestore from '@google-cloud/firestore'
import "reflect-metadata"
import { create } from 'domain';
import { Pring } from './pring'
import { Query } from '@google-cloud/firestore';
import { Document } from './test/test_document';

export class DataSource<Element extends Pring.Base> {

    element: { new(): Element; }

    query: FirebaseFirestore.Query

    observer: () => void

    constructor(element: {new(): Element; }, query: FirebaseFirestore.Query) {
        this.element = element
        this.query = query
    }

    private changeBlock?: (document: Element) => void

    private completedBlock?: (documents: Element[]) => void

    private errorBlock?: (error: Error) => void

    on(block: (document: Element) => void): this {
        this.changeBlock = block
        return this
    }

    completed(block: (documents: Element[]) => void): this {
        this.completedBlock = block
        return this
    }

    onError(block: (error: Error) => void): this {
        this.errorBlock = block
        return this
    }

    listen(): this {
        this.observer = this.query.onSnapshot( snapshot => {
            const documents = snapshot.docs.map( snapshot => {
                let element = new this.element()
                element.init(snapshot)
                this.changeBlock(element)
                return element
            })
            this.completedBlock(documents)
        }, error => {
            this.errorBlock(error)
        })
        return this
    }

    unsubscribe() {
        this.observer()
    }
}
