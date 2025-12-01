"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const smb2_message_1 = __importDefault(require("../tools/smb2-message"));
const message_1 = __importDefault(require("../tools/message"));
exports.default = (0, message_1.default)({
    generate(connection) {
        return new smb2_message_1.default({
            headers: {
                Command: 'NEGOTIATE',
                ProcessId: connection.ProcessId,
            },
        });
    },
});
//# sourceMappingURL=negotiate.js.map