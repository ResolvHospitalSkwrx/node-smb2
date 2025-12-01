"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const smb2_message_1 = __importDefault(require("../tools/smb2-message"));
const message_1 = __importDefault(require("../tools/message"));
exports.default = (0, message_1.default)({
    generate(connection, params) {
        const buffer = Buffer.from(params.path, 'ucs2');
        return new smb2_message_1.default({
            headers: {
                Command: 'CREATE',
                SessionId: connection.SessionId,
                TreeId: connection.TreeId,
                ProcessId: connection.ProcessId,
            },
            request: {
                Buffer: buffer,
                DesiredAccess: 0x001701df,
                NameOffset: 0x0078,
                CreateContextsOffset: 0x007a + buffer.length,
            },
        });
    },
});
//# sourceMappingURL=open.js.map