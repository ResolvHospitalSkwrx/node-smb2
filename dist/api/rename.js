"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = renameFile;
const bigint_1 = __importDefault(require("../tools/bigint"));
const smb2_forge_1 = __importDefault(require("../tools/smb2-forge"));
const SMB2Request = smb2_forge_1.default.request;
function renameBuffer(newPath) {
    const filename = Buffer.from(newPath, 'ucs2');
    return Buffer.concat([
        new bigint_1.default(1, 0).toBuffer(),
        new bigint_1.default(7, 0).toBuffer(),
        new bigint_1.default(8, 0).toBuffer(),
        new bigint_1.default(4, filename.length).toBuffer(),
        filename,
    ]);
}
function rename(connection, file, newPath, cb) {
    SMB2Request('set_info', {
        FileId: file.FileId,
        FileInfoClass: 'FileRenameInformation',
        Buffer: renameBuffer(newPath),
    }, connection, (err) => {
        if (err)
            cb && cb(err);
        else
            SMB2Request('close', file, connection, (err) => {
                cb && cb(null);
            });
    });
}
function renameFile(oldPath, newPath, cb) {
    const connection = this;
    SMB2Request('open_folder', { path: oldPath }, connection, (err, file) => {
        if (err)
            SMB2Request('open', { path: oldPath }, connection, (err, file) => {
                if (err)
                    cb && cb(err);
                else
                    rename(connection, file, newPath, cb);
            });
        else
            rename(connection, file, newPath, cb);
    });
}
//# sourceMappingURL=rename.js.map