import * as firebase from 'firebase-admin'
import * as FirebaseFirestore from '@google-cloud/firestore'

// pring export
import { BatchType } from './batchable'
import { Base, property } from './base'
import { SubCollection } from './subCollection'
import { NestedCollection } from './nestedCollection'
import { ReferenceCollection } from './referenceCollection'
import { File } from './file'

export { BatchType, Base, property, SubCollection, NestedCollection, ReferenceCollection, File }
export let firestore: FirebaseFirestore.Firestore
export const initialize = (options?: firebase.AppOptions & any) => {
    firestore = new FirebaseFirestore.Firestore(options)
}
export const batch = (): FirebaseFirestore.WriteBatch => {
    return firestore.batch()
}