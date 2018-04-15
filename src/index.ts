import * as admin from 'firebase-admin'
import * as FirebaseFirestore from '@google-cloud/firestore'

// pring export
import { BatchType } from './batchable'
import { Base, property } from './base'
import { SubCollection } from './subCollection'
import { NestedCollection } from './nestedCollection'
import { ReferenceCollection } from './referenceCollection'
import { File } from './file'

export { BatchType, Base, property, SubCollection, NestedCollection, ReferenceCollection, File }
export let firestore: admin.firestore.Firestore
export const initialize = (options?: any) => {
    firestore = new admin.firestore.Firestore(options)
}
export const batch = (): FirebaseFirestore.WriteBatch => {
    return firestore.batch()
}