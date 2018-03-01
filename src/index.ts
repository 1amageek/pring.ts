import * as FirebaseFirestore from '@google-cloud/firestore'

// pring export
import * as base from './base'
import * as subCollection from './subCollection'
import * as nestedCollection from './nestedCollection'
import * as referenceCollection from './referenceCollection'
import * as file from './file'

export { base, subCollection, nestedCollection, referenceCollection, file }
export let firestore: FirebaseFirestore.Firestore
export function initialize(options?: any) {
    firestore = new FirebaseFirestore.Firestore(options)
}