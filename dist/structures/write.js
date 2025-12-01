"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.structure = void 0;
exports.structure = {
    request: [
        ['StructureSize', 2, 49],
        ['DataOffset', 2, 0x70],
        ['Length', 4, 0],
        ['Offset', 8],
        ['FileId', 16],
        ['Channel', 4, 0],
        ['RemainingBytes', 4, 0],
        ['WriteChannelInfoOffset', 2, 0],
        ['WriteChannelInfoLength', 2, 0],
        ['Flags', 4, 0],
        ['Buffer', 'Length'],
    ],
    response: [
        ['StructureSize', 2],
        ['Reserved', 2],
        ['Count', 4],
        ['Remaining', 4],
        ['WriteChannelInfoOffset', 2],
        ['WriteChannelInfoLength', 2],
    ],
};
exports.default = exports.structure;
//# sourceMappingURL=write.js.map