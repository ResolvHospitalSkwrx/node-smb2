import SMB2Message from '../tools/smb2-message';
import message from '../tools/message';
import { SMB2Connection } from '../types';

export default message({
  generate(connection: SMB2Connection, params: any) {
    return new SMB2Message({
      headers: {
        Command: 'WRITE',
        SessionId: connection.SessionId,
        TreeId: connection.TreeId,
        ProcessId: connection.ProcessId,
      },
      request: {
        FileId: params.FileId,
        Offset: params.Offset,
        Buffer: params.Buffer,
      },
    });
  },
});
