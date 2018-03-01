import * as FirebaseFirestore from '@google-cloud/firestore'
import * as firebase from 'firebase-admin'

// pring export
import { Base, property } from './base'
import { SubCollection } from './subCollection'
import { NestedCollection } from './nestedCollection'
import { ReferenceCollection } from './referenceCollection'
import { File } from './file'

export { Base, property, SubCollection, NestedCollection, ReferenceCollection, File }
export let firestore: FirebaseFirestore.Firestore
export function initialize(options?: firebase.AppOptions) {
    firestore = new FirebaseFirestore.Firestore(options)
}