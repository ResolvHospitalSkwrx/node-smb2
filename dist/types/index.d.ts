export interface SMB2Options {
    share: string;
    domain?: string;
    username?: string;
    password?: string;
    port?: number;
    packetConcurrency?: number;
    autoCloseTimeout?: number;
    debug?: boolean;
}
export interface SMB2Connection {
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
    TreeId?: any;
    nonce?: any;
}
export interface SMB2Headers {
    ProtocolId?: Buffer | number;
    StructureSize?: Buffer | number;
    CreditCharge?: Buffer | number;
    Status?: Buffer | number;
    Command?: string | number;
    Credit?: Buffer | number;
    Flags?: Buffer | number;
    NextCommand?: Buffer | number;
    MessageId?: Buffer | number;
    MessageIdHigh?: Buffer | number;
    ProcessId?: Buffer | number;
    TreeId?: Buffer | number;
    SessionId?: Buffer | number;
    Signature?: Buffer | number;
    AsyncId?: Buffer | number;
    [key: string]: Buffer | number | string | undefined;
}
export interface SMB2MessageOptions {
    headers?: SMB2Headers;
    request?: any;
}
export interface SMB2Structure {
    request: Array<[string, number | string, any?]>;
    response: Array<[string, number | string, any?]>;
}
export interface FileInfo {
    FileId: Buffer;
    EndofFile: Buffer;
    AllocationSize?: Buffer;
    FileAttributes?: number;
    CreationTime?: Buffer;
    LastAccessTime?: Buffer;
    LastWriteTime?: Buffer;
    ChangeTime?: Buffer;
}
export interface ReadFileOptions {
    encoding?: BufferEncoding;
}
export type SMB2Callback<T = any> = (err: Error | null, result?: T) => void;
//# sourceMappingURL=index.d.ts.map