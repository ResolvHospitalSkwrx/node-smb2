import SMB2Message from '../tools/smb2-message';
import message from '../tools/message';
import { SMB2Connection } from '../types';

export default message({
  generate(connection: SMB2Connection, file: any) {
    return new SMB2Message({
      headers: {
        Command: 'READ',
        SessionId: connection.SessionId,
        TreeId: connection.TreeId,
        ProcessId: connection.ProcessId,
      },
      request: {
        FileId: file.FileId,
        Length: file.Length,
        Offset: file.Offset,
      },
    });
  },

  parseResponse(response: SMB2Message) {
    return response.getResponse().Buffer;
  },
});
