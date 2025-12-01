import SMB2Message from '../tools/smb2-message';
import message from '../tools/message';
import { SMB2Connection } from '../types';
import * as ntlm from 'ntlm';

export default message({
  generate(connection: SMB2Connection) {
    return new SMB2Message({
      headers: {
        Command: 'SESSION_SETUP',
        ProcessId: connection.ProcessId,
      },
      request: {
        Buffer: ntlm.encodeType1(connection.ip, connection.domain),
      },
    });
  },

  successCode: 'STATUS_MORE_PROCESSING_REQUIRED',

  onSuccess(connection: any, response: SMB2Message) {
    const h = response.getHeaders();
    connection.SessionId = h.SessionId;
    connection.nonce = ntlm.decodeType2(response.getResponse().Buffer);
  },
});
