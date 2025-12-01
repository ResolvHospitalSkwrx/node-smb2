"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = close;
const smb2_connection_1 = __importDefault(require("../tools/smb2-connection"));
function close() {
    smb2_connection_1.default.close(this);
}
//# sourceMappingURL=close.js.map