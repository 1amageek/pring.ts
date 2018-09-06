import { Base } from './base'
import { Query } from './query'

export class Option {
    public timeout: number = 10
}

export class DataSource <T extends Base> {

    public query: Query

    public option: Option

    constructor(query: Query, option: Option = new Option()) {
        this.query = query
        this.option = option
    }

    public listen(): this {
        this.query.listen({
            next: (snapshot) => {
                console.log(snapshot)
            },
            error: (error) => {

            },
            complete: () => {

            }
        })
        return this
    }

}