import { SMB2Connection as SMB2Conn, SMB2Callback } from '../types';
export interface ExtendedConnection extends SMB2Conn {
    scheduledAutoClose?: NodeJS.Timeout | null;
    close: () => void;
}
export declare const SMB2Connection: {
    close(connection: ExtendedConnection): void;
    requireConnect<T extends any[]>(method: (this: ExtendedConnection, ...args: [...T, SMB2Callback]) => void): (this: ExtendedConnection, ...args: [...T, SMB2Callback]) => void;
    init(connection: ExtendedConnection): void;
};
export default SMB2Connection;
//# sourceMappingURL=smb2-connection.d.ts.map