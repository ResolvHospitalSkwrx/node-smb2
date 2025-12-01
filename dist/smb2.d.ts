import { ExtendedConnection } from './tools/smb2-connection';
import { SMB2Options, SMB2Callback } from './types';
import close from './api/close';
export declare class SMB2 implements ExtendedConnection {
    ip: string;
    port: number;
    messageId: number;
    share: string;
    fullPath: string;
    packetConcurrency: number;
    autoCloseTimeout: number;
    domain?: string;
    username?: string;
    password?: string;
    SessionId: number;
    ProcessId: Buffer;
    debug?: boolean;
    connected: boolean;
    socket: any;
    errorHandler: Array<(err: Error) => void>;
    responses: {
        [key: string]: any;
    };
    responsesCB: {
        [key: string]: (message: any) => void;
    };
    responseBuffer: Buffer;
    newResponse?: boolean;
    scheduledAutoClose?: NodeJS.Timeout | null;
    TreeId?: any;
    nonce?: any;
    constructor(opt: SMB2Options);
    close: typeof close;
    exists: (this: ExtendedConnection, path: string, args_1: SMB2Callback) => void;
    rename: (this: ExtendedConnection, oldPath: string, newPath: string, args_2: SMB2Callback) => void;
    readFile: (this: ExtendedConnection, filename: string, options: import("./types").ReadFileOptions | SMB2Callback, args_2: SMB2Callback) => void;
    writeFile: (this: ExtendedConnection, filename: string, data: string | Buffer<ArrayBufferLike>, options: SMB2Callback | import("./api/writefile").WriteFileOptions, args_3: SMB2Callback) => void;
    unlink: (this: ExtendedConnection, path: string, args_1: SMB2Callback) => void;
    readdir: (this: ExtendedConnection, path: string, args_1: SMB2Callback) => void;
    rmdir: (this: ExtendedConnection, path: string, args_1: SMB2Callback) => void;
    mkdir: (this: ExtendedConnection, path: string, mode: string | SMB2Callback, args_2: SMB2Callback) => void;
}
export default SMB2;
//# sourceMappingURL=smb2.d.ts.map