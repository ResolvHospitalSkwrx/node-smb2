import SMB2Message from './smb2-message';
import { SMB2Connection, SMB2Callback } from '../types';
import { getMessage } from '../messages';

export interface MessageModule {
  generate: (connection: SMB2Connection, params: any) => SMB2Message;
  parse: (connection: SMB2Connection, cb: SMB2Callback) => (message: SMB2Message) => void;
}

export const SMB2Forge = {
  request(messageName: string, params: any, connection: SMB2Connection, cb: SMB2Callback): void {
    const msg: MessageModule = getMessage(messageName) as MessageModule;
    const smbMessage = msg.generate(connection, params);

    sendNetBiosMessage(connection, smbMessage);
    getResponse(connection, smbMessage.getHeaders().MessageId as number, msg.parse(connection, cb));
  },

  response(c: SMB2Connection): (response: Buffer) => void {
    c.responses = {};
    c.responsesCB = {};
    c.responseBuffer = Buffer.alloc(0);

    return function (response: Buffer) {
      c.responseBuffer = Buffer.concat([c.responseBuffer, response]);

      let extract = true;
      while (extract) {
        extract = false;

        if (c.responseBuffer.length >= 4) {
          const msgLength =
            (c.responseBuffer.readUInt8(1) << 16) + c.responseBuffer.readUInt16BE(2);
          if (c.responseBuffer.length >= msgLength + 4) {
            extract = true;

            const r = c.responseBuffer.slice(4, msgLength + 4);
            const message = new SMB2Message();
            message.parseBuffer(r);

            if (c.debug) {
              console.log('--response');
              console.log(r.toString('hex'));
            }

            const mId = (message.getHeaders().MessageId as Buffer).toString('hex');

            if (c.responsesCB[mId]) {
              c.responsesCB[mId](message);
              delete c.responsesCB[mId];
            } else {
              c.responses[mId] = message;
            }

            c.responseBuffer = c.responseBuffer.slice(msgLength + 4);
          }
        }
      }
    };
  },
};

function sendNetBiosMessage(connection: SMB2Connection, message: SMB2Message): boolean {
  const smbRequest = message.getBuffer(connection);

  if (connection.debug) {
    console.log('--request');
    console.log(smbRequest.toString('hex'));
  }

  const buffer = Buffer.alloc(smbRequest.length + 4);

  buffer.writeUInt8(0x00, 0);
  buffer.writeUInt8((0xff0000 & smbRequest.length) >> 16, 1);
  buffer.writeUInt16BE(0xffff & smbRequest.length, 2);
  smbRequest.copy(buffer, 4, 0, smbRequest.length);

  connection.newResponse = false;
  connection.socket.write(buffer);

  return true;
}

function getResponse(
  c: SMB2Connection,
  mId: number,
  cb: (message: SMB2Message) => void
): void {
  const messageId = Buffer.alloc(4);
  messageId.writeUInt32LE(mId, 0);
  const messageIdHex = messageId.toString('hex');

  if (c.responses[messageIdHex]) {
    cb(c.responses[messageIdHex]);
    delete c.responses[messageIdHex];
  } else {
    c.responsesCB[messageIdHex] = cb;
  }
}

export default SMB2Forge;
