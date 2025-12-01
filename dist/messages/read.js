"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const smb2_message_1 = __importDefault(require("../tools/smb2-message"));
const message_1 = __importDefault(require("../tools/message"));
exports.default = (0, message_1.default)({
    generate(connection, file) {
        return new smb2_message_1.default({
            headers: {
                Command: 'READ',
                SessionId: connection.SessionId,
                TreeId: connection.TreeId,
                ProcessId: connection.ProcessId,
            },
            request: {
                FileId: file.FileId,
                Length: file.Length,
                Offset: file.Offset,
            },
        });
    },
    parseResponse(response) {
        return response.getResponse().Buffer;
    },
});
//# sourceMappingURL=read.js.map