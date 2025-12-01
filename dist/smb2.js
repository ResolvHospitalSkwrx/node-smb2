"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMB2 = void 0;
const smb2_connection_1 = __importDefault(require("./tools/smb2-connection"));
const close_1 = __importDefault(require("./api/close"));
const exists_1 = __importDefault(require("./api/exists"));
const mkdir_1 = __importDefault(require("./api/mkdir"));
const readdir_1 = __importDefault(require("./api/readdir"));
const readfile_1 = __importDefault(require("./api/readfile"));
const rename_1 = __importDefault(require("./api/rename"));
const rmdir_1 = __importDefault(require("./api/rmdir"));
const unlink_1 = __importDefault(require("./api/unlink"));
const writefile_1 = __importDefault(require("./api/writefile"));
const shareRegExp = /\\\\([^\\]*)\\([^\\]*)\\?/;
const port = 445;
const packetConcurrency = 20;
const autoCloseTimeout = 10000;
class SMB2 {
    constructor(opt) {
        this.close = close_1.default;
        this.exists = smb2_connection_1.default.requireConnect(exists_1.default);
        this.rename = smb2_connection_1.default.requireConnect(rename_1.default);
        this.readFile = smb2_connection_1.default.requireConnect(readfile_1.default);
        this.writeFile = smb2_connection_1.default.requireConnect(writefile_1.default);
        this.unlink = smb2_connection_1.default.requireConnect(unlink_1.default);
        this.readdir = smb2_connection_1.default.requireConnect(readdir_1.default);
        this.rmdir = smb2_connection_1.default.requireConnect(rmdir_1.default);
        this.mkdir = smb2_connection_1.default.requireConnect(mkdir_1.default);
        const matches = opt.share.match(shareRegExp);
        if (!matches) {
            throw new Error('the share is not valid');
        }
        this.ip = matches[1];
        this.port = opt.port || port;
        this.messageId = 0;
        this.share = matches[2];
        this.fullPath = opt.share;
        this.packetConcurrency = opt.packetConcurrency || packetConcurrency;
        if (opt.autoCloseTimeout !== undefined) {
            this.autoCloseTimeout = opt.autoCloseTimeout;
        }
        else {
            this.autoCloseTimeout = autoCloseTimeout;
        }
        this.domain = opt.domain;
        this.username = opt.username;
        this.password = opt.password;
        this.SessionId = Math.floor(Math.random() * 256) & 0xff;
        this.ProcessId = Buffer.from([
            Math.floor(Math.random() * 256) & 0xff,
            Math.floor(Math.random() * 256) & 0xff,
            Math.floor(Math.random() * 256) & 0xff,
            Math.floor(Math.random() * 256) & 0xfe,
        ]);
        this.debug = opt.debug;
        this.connected = false;
        this.socket = null;
        this.errorHandler = [];
        this.responses = {};
        this.responsesCB = {};
        this.responseBuffer = Buffer.alloc(0);
        smb2_connection_1.default.init(this);
    }
}
exports.SMB2 = SMB2;
exports.default = SMB2;
//# sourceMappingURL=smb2.js.map