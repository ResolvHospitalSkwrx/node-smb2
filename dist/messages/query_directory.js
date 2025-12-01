"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const smb2_message_1 = __importDefault(require("../tools/smb2-message"));
const message_1 = __importDefault(require("../tools/message"));
function parseFiles(buffer) {
    const files = [];
    let offset = 0;
    let nextFileOffset = -1;
    while (nextFileOffset !== 0) {
        nextFileOffset = buffer.readUInt32LE(offset);
        files.push(parseFile(buffer.slice(offset + 4, nextFileOffset ? offset + nextFileOffset : buffer.length)));
        offset += nextFileOffset;
    }
    return files;
}
function parseFile(buffer) {
    const file = {};
    let offset = 0;
    file.Index = buffer.readUInt32LE(offset);
    offset += 4;
    file.CreationTime = buffer.slice(offset, offset + 8);
    offset += 8;
    file.LastAccessTime = buffer.slice(offset, offset + 8);
    offset += 8;
    file.LastWriteTime = buffer.slice(offset, offset + 8);
    offset += 8;
    file.ChangeTime = buffer.slice(offset, offset + 8);
    offset += 8;
    file.EndofFile = buffer.slice(offset, offset + 8);
    offset += 8;
    file.AllocationSize = buffer.slice(offset, offset + 8);
    offset += 8;
    file.FileAttributes = buffer.readUInt32LE(offset);
    offset += 4;
    file.FilenameLength = buffer.readUInt32LE(offset);
    offset += 4;
    file.EASize = buffer.readUInt32LE(offset);
    offset += 4;
    file.ShortNameLength = buffer.readUInt8(offset);
    offset += 1;
    file.FileId = buffer.slice(offset, offset + 8);
    offset += 8;
    offset += 27;
    file.Filename = buffer.slice(offset, offset + file.FilenameLength).toString('ucs2');
    offset += file.FilenameLength;
    return file;
}
exports.default = (0, message_1.default)({
    generate(connection, params) {
        return new smb2_message_1.default({
            headers: {
                Command: 'QUERY_DIRECTORY',
                SessionId: connection.SessionId,
                TreeId: connection.TreeId,
                ProcessId: connection.ProcessId,
            },
            request: {
                FileId: params.FileId,
                Buffer: Buffer.from('*', 'ucs2'),
            },
        });
    },
    parseResponse(response) {
        return parseFiles(response.getResponse().Buffer);
    },
});
//# sourceMappingURL=query_directory.js.map