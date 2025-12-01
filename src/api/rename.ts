import BigInt from '../tools/bigint';
import SMB2Forge from '../tools/smb2-forge';
import { ExtendedConnection } from '../tools/smb2-connection';
import { SMB2Callback } from '../types';

const SMB2Request = SMB2Forge.request;

function renameBuffer(newPath: string): Buffer {
  const filename = Buffer.from(newPath, 'ucs2');

  return Buffer.concat([
    new BigInt(1, 0).toBuffer(),
    new BigInt(7, 0).toBuffer(),
    new BigInt(8, 0).toBuffer(),
    new BigInt(4, filename.length).toBuffer(),
    filename,
  ]);
}

function rename(connection: ExtendedConnection, file: any, newPath: string, cb: SMB2Callback): void {
  SMB2Request(
    'set_info',
    {
      FileId: file.FileId,
      FileInfoClass: 'FileRenameInformation',
      Buffer: renameBuffer(newPath),
    },
    connection,
    (err) => {
      if (err) cb && cb(err);
      else
        SMB2Request('close', file, connection, (err) => {
          cb && cb(null);
        });
    }
  );
}

export default function renameFile(
  this: ExtendedConnection,
  oldPath: string,
  newPath: string,
  cb: SMB2Callback
): void {
  const connection = this;

  SMB2Request('open_folder', { path: oldPath }, connection, (err, file) => {
    if (err)
      SMB2Request('open', { path: oldPath }, connection, (err, file) => {
        if (err) cb && cb(err);
        else rename(connection, file, newPath, cb);
      });
    else rename(connection, file, newPath, cb);
  });
}
