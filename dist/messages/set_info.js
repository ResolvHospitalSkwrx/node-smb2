"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const smb2_message_1 = __importDefault(require("../tools/smb2-message"));
const message_1 = __importDefault(require("../tools/message"));
const fileInfoClasses = {
    FileAllocationInformation: 19,
    FileBasicInformation: 4,
    FileDispositionInformation: 13,
    FileEndOfFileInformation: 20,
    FileFullEaInformation: 15,
    FileLinkInformation: 11,
    FileModeInformation: 16,
    FilePipeInformation: 23,
    FilePositionInformation: 14,
    FileRenameInformation: 10,
    FileShortNameInformation: 40,
    FileValidDataLengthInformation: 39,
};
exports.default = (0, message_1.default)({
    generate(connection, params) {
        return new smb2_message_1.default({
            headers: {
                Command: 'SET_INFO',
                SessionId: connection.SessionId,
                TreeId: connection.TreeId,
                ProcessId: connection.ProcessId,
            },
            request: {
                FileInfoClass: fileInfoClasses[params.FileInfoClass],
                FileId: params.FileId,
                Buffer: params.Buffer,
            },
        });
    },
});
//# sourceMappingURL=set_info.js.map