import { SMB2Structure } from '../types';

export const structure: SMB2Structure = {
  request: [
    ['StructureSize', 2, 33],
    ['FileInformationClass', 1, 0x25],
    ['Flags', 1, 0],
    ['FileIndex', 4, 0],
    ['FileId', 16],
    ['FileNameOffset', 2, 96],
    ['FileNameLength', 2],
    ['OutputBufferLength', 4, 0x00010000],
    ['Buffer', 'FileNameLength'],
  ],

  response: [
    ['StructureSize', 2],
    ['OutputBufferOffset', 2],
    ['OutputBufferLength', 4],
    ['Buffer', 'OutputBufferLength'],
  ],
};

export default structure;
