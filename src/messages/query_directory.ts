import SMB2Message from '../tools/smb2-message';
import message from '../tools/message';
import { SMB2Connection } from '../types';

interface FileInfo {
  Index: number;
  CreationTime: Buffer;
  LastAccessTime: Buffer;
  LastWriteTime: Buffer;
  ChangeTime: Buffer;
  EndofFile: Buffer;
  AllocationSize: Buffer;
  FileAttributes: number;
  FilenameLength: number;
  EASize: number;
  ShortNameLength: number;
  FileId: Buffer;
  Filename: string;
}

function parseFiles(buffer: Buffer): FileInfo[] {
  const files: FileInfo[] = [];
  let offset = 0;
  let nextFileOffset = -1;

  while (nextFileOffset !== 0) {
    nextFileOffset = buffer.readUInt32LE(offset);
    files.push(
      parseFile(
        buffer.slice(offset + 4, nextFileOffset ? offset + nextFileOffset : buffer.length)
      )
    );
    offset += nextFileOffset;
  }
  return files;
}

function parseFile(buffer: Buffer): FileInfo {
  const file: any = {};
  let offset = 0;

  file.Index = buffer.readUInt32LE(offset);
  offset += 4;

  file.CreationTime = buffer.slice(offset, offset + 8);
  offset += 8;

  file.LastAccessTime = buffer.slice(offset, offset + 8);
  offset += 8;

  file.LastWriteTime = buffer.slice(offset, offset + 8);
  offset += 8;

  file.ChangeTime = buffer.slice(offset, offset + 8);
  offset += 8;

  file.EndofFile = buffer.slice(offset, offset + 8);
  offset += 8;

  file.AllocationSize = buffer.slice(offset, offset + 8);
  offset += 8;

  file.FileAttributes = buffer.readUInt32LE(offset);
  offset += 4;

  file.FilenameLength = buffer.readUInt32LE(offset);
  offset += 4;

  file.EASize = buffer.readUInt32LE(offset);
  offset += 4;

  file.ShortNameLength = buffer.readUInt8(offset);
  offset += 1;

  file.FileId = buffer.slice(offset, offset + 8);
  offset += 8;

  offset += 27;

  file.Filename = buffer.slice(offset, offset + file.FilenameLength).toString('ucs2');
  offset += file.FilenameLength;

  return file;
}

export default message({
  generate(connection: SMB2Connection, params: any) {
    return new SMB2Message({
      headers: {
        Command: 'QUERY_DIRECTORY',
        SessionId: connection.SessionId,
        TreeId: connection.TreeId,
        ProcessId: connection.ProcessId,
      },
      request: {
        FileId: params.FileId,
        Buffer: Buffer.from('*', 'ucs2'),
      },
    });
  },

  parseResponse(response: SMB2Message) {
    return parseFiles(response.getResponse().Buffer);
  },
});
