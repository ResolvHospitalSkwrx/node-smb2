import SMB2Message from '../tools/smb2-message';
import message from '../tools/message';
import { SMB2Connection } from '../types';

export default message({
  generate(connection: SMB2Connection, params: any) {
    const buffer = Buffer.from(params.path, 'ucs2');

    return new SMB2Message({
      headers: {
        Command: 'CREATE',
        SessionId: connection.SessionId,
        TreeId: connection.TreeId,
        ProcessId: connection.ProcessId,
      },
      request: {
        Buffer: buffer,
        FileAttributes: 0x00000000,
        ShareAccess: 0x00000007,
        CreateDisposition: 0x00000001,
        CreateOptions: 0x00200021,
        NameOffset: 0x0078,
        CreateContextsOffset: 0x007a + buffer.length,
      },
    });
  },
});
