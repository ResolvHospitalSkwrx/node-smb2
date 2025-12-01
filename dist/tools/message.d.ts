import SMB2Message from './smb2-message';
import { SMB2Connection, SMB2Callback } from '../types';
export interface MessageConfig {
    successCode?: string;
    generate: (connection: SMB2Connection, params?: any) => SMB2Message;
    parse?: (connection: SMB2Connection, cb: SMB2Callback) => (response: SMB2Message) => void;
    parseResponse?: (response: SMB2Message) => any;
    onSuccess?: (connection: SMB2Connection, response: SMB2Message) => void;
}
export default function message(obj: MessageConfig): MessageConfig;
//# sourceMappingURL=message.d.ts.map