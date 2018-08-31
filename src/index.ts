import * as FirebaseFirestore from '@google-cloud/firestore'
import * as admin from 'firebase-admin'
import * as firebase from 'firebase'
import { BatchType } from './batch'
import { Base, property } from './base'
import { SubCollection } from './subCollection'
import { NestedCollection } from './nestedCollection'
import { ReferenceCollection } from './referenceCollection'
import { File } from './file'

export { BatchType, Base, property, SubCollection, NestedCollection, ReferenceCollection, File }

export let firestore: admin.firestore.Firestore | firebase.firestore.Firestore

export let timestamp: FirebaseFirestore.FieldValue

export const initialize = (app: admin.app.App | firebase.app.App, serverTimestamp: admin.firestore.FieldValue | firebase.firestore.FieldValue) => {
    firestore = app.firestore()
    if (firestore instanceof admin.firestore.Firestore) {
        firestore.settings({timestampsInSnapshots: true})
    }
    if (firestore instanceof firebase.firestore.Firestore) {
        firestore.settings({timestampsInSnapshots: true})
    }
    timestamp = serverTimestamp
}