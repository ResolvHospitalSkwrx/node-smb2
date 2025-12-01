"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mkdir;
const smb2_forge_1 = __importDefault(require("../tools/smb2-forge"));
const SMB2Request = smb2_forge_1.default.request;
function mkdir(path, mode, cb) {
    if (typeof mode === 'function') {
        cb = mode;
        mode = '0777';
    }
    const connection = this;
    connection.exists(path, (err, exists) => {
        if (err)
            cb && cb(err);
        else if (!exists) {
            SMB2Request('create_folder', { path }, connection, (err, file) => {
                if (err)
                    cb && cb(err);
                else
                    SMB2Request('close', file, connection, (err) => {
                        cb && cb(null);
                    });
            });
        }
        else {
            cb && cb(new Error('File/Folder already exists'));
        }
    });
}
//# sourceMappingURL=mkdir.js.map