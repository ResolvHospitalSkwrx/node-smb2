import SMB2Message from './smb2-message';
import { SMB2Connection, SMB2Callback } from '../types';
export interface MessageModule {
    generate: (connection: SMB2Connection, params: any) => SMB2Message;
    parse: (connection: SMB2Connection, cb: SMB2Callback) => (message: SMB2Message) => void;
}
export declare const SMB2Forge: {
    request(messageName: string, params: any, connection: SMB2Connection, cb: SMB2Callback): void;
    response(c: SMB2Connection): (response: Buffer) => void;
};
export default SMB2Forge;
//# sourceMappingURL=smb2-forge.d.ts.map