import * as Pring from "../../../src/index";

const property = Pring.property;
const File = Pring.File;

export class User extends Pring.Base {
    @property public name?: string;
}
