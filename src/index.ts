import * as FirebaseFirestore from '@google-cloud/firestore'
import * as admin from 'firebase-admin'
import { BatchType } from './batchable'
import { Base, property } from './base'
import { SubCollection } from './subCollection'
import { NestedCollection } from './nestedCollection'
import { ReferenceCollection } from './referenceCollection'
import { File } from './file'

export { BatchType, Base, property, SubCollection, NestedCollection, ReferenceCollection, File }

export let firestore: FirebaseFirestore.Firestore

export let timestamp: admin.firestore.FieldValue

export const initialize = (app: admin.app.App, serverTimestamp: admin.firestore.FieldValue) => {
    firestore = app.firestore()
    timestamp = serverTimestamp
}