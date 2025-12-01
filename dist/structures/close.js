"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.structure = void 0;
exports.structure = {
    request: [
        ['StructureSize', 2, 24],
        ['Flags', 2, 0],
        ['Reserved', 4, 0],
        ['FileId', 16],
    ],
    response: [
        ['StructureSize', 2],
        ['Flags', 2],
        ['Reserved', 4],
        ['CreationTime', 8],
        ['LastAccessTime', 8],
        ['LastWriteTime', 8],
        ['ChangeTime', 8],
        ['AllocationSize', 8],
        ['EndofFile', 8],
        ['FileAttributes', 4],
    ],
};
exports.default = exports.structure;
//# sourceMappingURL=close.js.map