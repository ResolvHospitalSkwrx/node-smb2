"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = rmdir;
const smb2_forge_1 = __importDefault(require("../tools/smb2-forge"));
const bigint_1 = __importDefault(require("../tools/bigint"));
const SMB2Request = smb2_forge_1.default.request;
function rmdir(path, cb) {
    const connection = this;
    connection.exists(path, (err, exists) => {
        if (err)
            cb && cb(err);
        else if (exists) {
            SMB2Request('open_folder', { path }, connection, (err, file) => {
                if (err)
                    cb && cb(err);
                else
                    SMB2Request('set_info', {
                        FileId: file.FileId,
                        FileInfoClass: 'FileDispositionInformation',
                        Buffer: new bigint_1.default(1, 1).toBuffer(),
                    }, connection, (err, files) => {
                        if (err)
                            cb && cb(err);
                        else
                            SMB2Request('close', file, connection, (err) => {
                                cb && cb(null, files);
                            });
                    });
            });
        }
        else {
            cb && cb(new Error('Folder does not exists'));
        }
    });
}
//# sourceMappingURL=rmdir.js.map