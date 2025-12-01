"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exists;
const smb2_forge_1 = __importDefault(require("../tools/smb2-forge"));
const SMB2Request = smb2_forge_1.default.request;
function exists(path, cb) {
    const connection = this;
    SMB2Request('open', { path }, connection, (err, file) => {
        if (err)
            cb && cb(null, false);
        else
            SMB2Request('close', file, connection, (err) => {
                cb && cb(null, true);
            });
    });
}
//# sourceMappingURL=exists.js.map