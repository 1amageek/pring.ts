import * as firebase from 'firebase'
import { BatchType } from './batch'
import { Base, property } from './base'
import { SubCollection } from './subCollection'
import { NestedCollection } from './nestedCollection'
import { ReferenceCollection } from './referenceCollection'
import { File } from './file'

export { BatchType, Base, property, SubCollection, NestedCollection, ReferenceCollection, File }

export let firestore: firebase.firestore.Firestore

export let timestamp: firebase.firestore.FieldValue

export const initialize = (app: firebase.app.App, serverTimestamp: firebase.firestore.FieldValue) => {
    firestore = app.firestore()
    firestore.settings({timestampsInSnapshots: true})
    timestamp = serverTimestamp
}