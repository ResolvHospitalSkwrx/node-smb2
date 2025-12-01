import SMB2Forge from '../tools/smb2-forge';
import BigInt from '../tools/bigint';
import { ExtendedConnection } from '../tools/smb2-connection';
import { SMB2Callback } from '../types';

const SMB2Request = SMB2Forge.request;

export default function rmdir(this: any, path: string, cb: SMB2Callback): void {
  const connection = this;

  connection.exists(path, (err: Error | null, exists: boolean) => {
    if (err) cb && cb(err);
    else if (exists) {
      SMB2Request('open_folder', { path }, connection, (err, file) => {
        if (err) cb && cb(err);
        else
          SMB2Request(
            'set_info',
            {
              FileId: file.FileId,
              FileInfoClass: 'FileDispositionInformation',
              Buffer: new BigInt(1, 1).toBuffer(),
            },
            connection,
            (err, files) => {
              if (err) cb && cb(err);
              else
                SMB2Request('close', file, connection, (err) => {
                  cb && cb(null, files);
                });
            }
          );
      });
    } else {
      cb && cb(new Error('Folder does not exists'));
    }
  });
}
