var File = /** @class */ (function () {
    function File(name, url, mimeType) {
        this.name = name;
        this.url = url;
        this.mimeType = mimeType;
    }
    File.prototype.init = function (value) {
        var mimeType = "mimeType";
        var name = "name";
        var url = "url";
        this.mimeType = value[mimeType];
        this.name = value[name];
        this.url = value[url];
    };
    File.prototype.setValue = function (value, key) {
        this[key] = value;
    };
    File.prototype.value = function () {
        return {
            "name": this.name || "",
            "url": this.url || "",
            "mimeType": this.mimeType || ""
        };
    };
    return File;
}());
export { File };
//# sourceMappingURL=file.js.map