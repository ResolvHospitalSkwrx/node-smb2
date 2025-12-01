import { ExtendedConnection } from '../tools/smb2-connection';
import { SMB2Callback, ReadFileOptions } from '../types';
export default function readFile(this: ExtendedConnection, filename: string, options: ReadFileOptions | SMB2Callback, cb?: SMB2Callback<Buffer | string>): void;
//# sourceMappingURL=readfile.d.ts.map