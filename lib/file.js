export class File {
    constructor(name, url, mimeType) {
        this.name = name;
        this.url = url;
        this.mimeType = mimeType;
    }
    init(value) {
        const mimeType = "mimeType";
        const name = "name";
        const url = "url";
        this.mimeType = value[mimeType];
        this.name = value[name];
        this.url = value[url];
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
//# sourceMappingURL=file.js.map