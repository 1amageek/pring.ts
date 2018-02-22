import * as FirebaseFirestore from '@google-cloud/firestore'

// pring export
export * from './base'
export * from './subCollection'
export * from './nestedCollection'
export * from './referenceCollection'
export * from './file'

export let firestore: FirebaseFirestore.Firestore

export function initialize(options?: any) {
    firestore = new FirebaseFirestore.Firestore(options)
}