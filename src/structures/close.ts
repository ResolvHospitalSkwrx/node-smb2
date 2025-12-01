import { SMB2Structure } from '../types';

export const structure: SMB2Structure = {
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

export default structure;
