import { ValueProtocol } from './base';
export declare class File implements ValueProtocol {
    mimeType: string;
    name: string;
    url: string;
    constructor(name?: string, url?: string, mimeType?: string);
    init(value: object): void;
    setValue(value: any, key: string): void;
    value(): any;
}
