import { Base } from './base'
import { SubCollection } from './subCollection'

export class NestedCollection<T extends Base> extends SubCollection<T> { }
