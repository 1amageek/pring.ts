"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class File {
    constructor(name, url, mimeType) {
        this.name = name;
        this.url = url;
        this.mimeType = mimeType;
    }
    init(value) {
        this.mimeType = value["mimeType"];
        this.name = value["name"];
        this.url = value["url"];
    }
    setValue(value, key) {
        this[key] = value;
    }
    value() {
        return {
            "name": this.name || "",
            "url": this.url || "",
            "mimeType": this.mimeType || ""
        };
    }
}
exports.File = File;
//# sourceMappingURL=file.js.map