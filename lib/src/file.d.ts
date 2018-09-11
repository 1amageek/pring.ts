import { ValueProtocol, FileData } from './base';
export declare class File implements ValueProtocol {
    mimeType?: string;
    name?: string;
    url?: string;
    constructor(name?: string, url?: string, mimeType?: string);
    init(value: FileData): void;
    setValue(value: any, key: (keyof FileData)): void;
    value(): any;
}
