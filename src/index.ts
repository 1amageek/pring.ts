import { BatchType } from './batchable'
import { Base, property } from './base'
import { SubCollection } from './subCollection'
import { NestedCollection } from './nestedCollection'
import { ReferenceCollection } from './referenceCollection'
import { File } from './file'

export { BatchType, Base, property, SubCollection, NestedCollection, ReferenceCollection, File }

export let firestore: FirebaseFirestore.Firestore

export const initialize = (options?: any) => {
    firestore = new FirebaseFirestore.Firestore(options)
}