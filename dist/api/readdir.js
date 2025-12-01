"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = readdir;
const smb2_forge_1 = __importDefault(require("../tools/smb2-forge"));
const SMB2Request = smb2_forge_1.default.request;
function queryDir(file, connection, completeFileListing, cb) {
    SMB2Request('query_directory', file, connection, (err, files) => {
        const allFiles = completeFileListing.concat(files || []);
        if (err && err.code === 'STATUS_NO_MORE_FILES') {
            return SMB2Request('close', file, connection, (err) => {
                const fileNames = allFiles
                    .map((v) => v.Filename)
                    .filter((v) => v !== '.' && v !== '..');
                cb && cb(null, fileNames);
            });
        }
        if (err) {
            return cb && cb(err);
        }
        queryDir(file, connection, allFiles, cb);
    });
}
function readdir(path, cb) {
    const connection = this;
    SMB2Request('open_folder', { path }, connection, (err, file) => {
        if (err)
            cb && cb(err);
        else
            queryDir(file, connection, [], cb);
    });
}
//# sourceMappingURL=readdir.js.map