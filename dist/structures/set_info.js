"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.structure = void 0;
exports.structure = {
    request: [
        ['StructureSize', 2, 33],
        ['InfoType', 1, 1],
        ['FileInfoClass', 1],
        ['BufferLength', 4],
        ['BufferOffset', 2, 0x0060],
        ['Reserved', 2, 0],
        ['AdditionalInformation', 4, 0],
        ['FileId', 16],
        ['Buffer', 'BufferLength'],
    ],
    response: [['StructureSize', 2]],
};
exports.default = exports.structure;
//# sourceMappingURL=set_info.js.map