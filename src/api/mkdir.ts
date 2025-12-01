import SMB2Forge from '../tools/smb2-forge';
import { ExtendedConnection } from '../tools/smb2-connection';
import { SMB2Callback } from '../types';

const SMB2Request = SMB2Forge.request;

export default function mkdir(
  this: any,
  path: string,
  mode: string | SMB2Callback,
  cb?: SMB2Callback
): void {
  if (typeof mode === 'function') {
    cb = mode;
    mode = '0777';
  }

  const connection = this;

  connection.exists(path, (err: Error | null, exists: boolean) => {
    if (err) cb && cb(err);
    else if (!exists) {
      SMB2Request('create_folder', { path }, connection, (err, file) => {
        if (err) cb && cb(err);
        else
          SMB2Request('close', file, connection, (err) => {
            cb && cb(null);
          });
      });
    } else {
      cb && cb(new Error('File/Folder already exists'));
    }
  });
}
