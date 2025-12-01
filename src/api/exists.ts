import SMB2Forge from '../tools/smb2-forge';
import { ExtendedConnection } from '../tools/smb2-connection';
import { SMB2Callback } from '../types';

const SMB2Request = SMB2Forge.request;

export default function exists(this: ExtendedConnection, path: string, cb: SMB2Callback<boolean>): void {
  const connection = this;

  SMB2Request('open', { path }, connection, (err, file) => {
    if (err) cb && cb(null, false);
    else
      SMB2Request('close', file, connection, (err) => {
        cb && cb(null, true);
      });
  });
}
