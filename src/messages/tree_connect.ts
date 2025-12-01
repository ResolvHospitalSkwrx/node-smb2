import SMB2Message from '../tools/smb2-message';
import message from '../tools/message';
import { SMB2Connection } from '../types';

export default message({
  generate(connection: SMB2Connection) {
    return new SMB2Message({
      headers: {
        Command: 'TREE_CONNECT',
        SessionId: connection.SessionId,
        ProcessId: connection.ProcessId,
      },
      request: {
        Buffer: Buffer.from(connection.fullPath, 'ucs2'),
      },
    });
  },

  onSuccess(connection: any, response: SMB2Message) {
    const h = response.getHeaders();
    connection.TreeId = h.TreeId;
  },
});
