import { SMB2MessageOptions, SMB2Headers, SMB2Structure, SMB2Connection } from '../types';
export declare class SMB2Message {
    headers: SMB2Headers;
    request: any;
    response: any;
    structure: SMB2Structure;
    isAsync: boolean;
    ProcessId: Buffer;
    SessionId: number;
    isMessageIdSetted: boolean;
    constructor(options?: SMB2MessageOptions);
    setHeaders(obj: SMB2Headers): void;
    getHeaders(): SMB2Headers;
    setRequest(request: any): void;
    getResponse(): any;
    getBuffer(connection: SMB2Connection): Buffer;
    parseBuffer(buffer: Buffer): void;
}
export default SMB2Message;
//# sourceMappingURL=smb2-message.d.ts.map