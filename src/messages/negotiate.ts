import SMB2Message from '../tools/smb2-message';
import message from '../tools/message';
import { SMB2Connection } from '../types';

export default message({
  generate(connection: SMB2Connection) {
    return new SMB2Message({
      headers: {
        Command: 'NEGOTIATE',
        ProcessId: connection.ProcessId,
      },
    });
  },
});
