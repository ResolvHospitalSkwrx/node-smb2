import { ExtendedConnection } from '../tools/smb2-connection';
import { SMB2Callback } from '../types';
export interface WriteFileOptions {
    encoding?: BufferEncoding;
}
export default function writeFile(this: ExtendedConnection, filename: string, data: string | Buffer, options: WriteFileOptions | SMB2Callback, cb?: SMB2Callback): void;
//# sourceMappingURL=writefile.d.ts.map