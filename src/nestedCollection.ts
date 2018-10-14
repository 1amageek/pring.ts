import { Base } from './base'
import { SubCollection } from './subCollection'

export class NestedCollection<T extends typeof Base> extends SubCollection<T> { }
