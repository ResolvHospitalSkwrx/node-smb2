"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessage = getMessage;
const close_1 = __importDefault(require("./close"));
const create_1 = __importDefault(require("./create"));
const create_folder_1 = __importDefault(require("./create_folder"));
const negotiate_1 = __importDefault(require("./negotiate"));
const open_1 = __importDefault(require("./open"));
const open_folder_1 = __importDefault(require("./open_folder"));
const query_directory_1 = __importDefault(require("./query_directory"));
const read_1 = __importDefault(require("./read"));
const session_setup_step1_1 = __importDefault(require("./session_setup_step1"));
const session_setup_step2_1 = __importDefault(require("./session_setup_step2"));
const set_info_1 = __importDefault(require("./set_info"));
const tree_connect_1 = __importDefault(require("./tree_connect"));
const write_1 = __importDefault(require("./write"));
const messageMap = {
    close: close_1.default,
    create: create_1.default,
    create_folder: create_folder_1.default,
    negotiate: negotiate_1.default,
    open: open_1.default,
    open_folder: open_folder_1.default,
    query_directory: query_directory_1.default,
    read: read_1.default,
    session_setup_step1: session_setup_step1_1.default,
    session_setup_step2: session_setup_step2_1.default,
    set_info: set_info_1.default,
    tree_connect: tree_connect_1.default,
    write: write_1.default,
};
function getMessage(messageName) {
    return messageMap[messageName];
}
//# sourceMappingURL=index.js.map