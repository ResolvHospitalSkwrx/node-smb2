import SMB2Message from '../tools/smb2-message';
import message from '../tools/message';
import { SMB2Connection } from '../types';
import * as ntlm from 'ntlm';

export default message({
  generate(connection: any) {
    return new SMB2Message({
      headers: {
        Command: 'SESSION_SETUP',
        SessionId: connection.SessionId,
        ProcessId: connection.ProcessId,
      },
      request: {
        Buffer: ntlm.encodeType3(
          connection.username,
          connection.ip,
          connection.domain,
          connection.nonce,
          connection.password
        ),
      },
    });
  },
});
