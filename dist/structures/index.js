"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStructure = getStructure;
const close_1 = __importDefault(require("./close"));
const create_1 = __importDefault(require("./create"));
const negotiate_1 = __importDefault(require("./negotiate"));
const query_directory_1 = __importDefault(require("./query_directory"));
const read_1 = __importDefault(require("./read"));
const session_setup_1 = __importDefault(require("./session_setup"));
const set_info_1 = __importDefault(require("./set_info"));
const tree_connect_1 = __importDefault(require("./tree_connect"));
const write_1 = __importDefault(require("./write"));
const structureMap = {
    close: close_1.default,
    create: create_1.default,
    negotiate: negotiate_1.default,
    query_directory: query_directory_1.default,
    read: read_1.default,
    session_setup: session_setup_1.default,
    set_info: set_info_1.default,
    tree_connect: tree_connect_1.default,
    write: write_1.default,
};
function getStructure(command) {
    return structureMap[command];
}
//# sourceMappingURL=index.js.map