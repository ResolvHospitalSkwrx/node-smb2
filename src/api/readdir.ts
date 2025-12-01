import SMB2Forge from '../tools/smb2-forge';
import { ExtendedConnection } from '../tools/smb2-connection';
import { SMB2Callback } from '../types';

const SMB2Request = SMB2Forge.request;

function queryDir(file: any, connection: ExtendedConnection, completeFileListing: any[], cb: SMB2Callback<string[]>): void {
  SMB2Request('query_directory', file, connection, (err, files) => {
    const allFiles = completeFileListing.concat(files || []);

    if (err && (err as any).code === 'STATUS_NO_MORE_FILES') {
      return SMB2Request('close', file, connection, (err) => {
        const fileNames = allFiles
          .map((v) => v.Filename)
          .filter((v) => v !== '.' && v !== '..');
        cb && cb(null, fileNames);
      });
    }

    if (err) {
      return cb && cb(err);
    }

    queryDir(file, connection, allFiles, cb);
  });
}

export default function readdir(this: ExtendedConnection, path: string, cb: SMB2Callback<string[]>): void {
  const connection = this;

  SMB2Request('open_folder', { path }, connection, (err, file) => {
    if (err) cb && cb(err);
    else queryDir(file, connection, [], cb);
  });
}
