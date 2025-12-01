import * as MsErref from './ms_erref';
import BigInt from './bigint';
import SMB2Message from './smb2-message';
import { SMB2Connection, SMB2Callback } from '../types';

export interface MessageConfig {
  successCode?: string;
  generate: (connection: SMB2Connection, params?: any) => SMB2Message;
  parse?: (connection: SMB2Connection, cb: SMB2Callback) => (response: SMB2Message) => void;
  parseResponse?: (response: SMB2Message) => any;
  onSuccess?: (connection: SMB2Connection, response: SMB2Message) => void;
}

const defaults: Partial<MessageConfig> = {
  successCode: 'STATUS_SUCCESS',

  parse(connection: SMB2Connection, cb: SMB2Callback) {
    const self = this;
    return function (response: SMB2Message) {
      const h = response.getHeaders();
      const err = MsErref.getStatus(BigInt.fromBuffer(h.Status as Buffer).toNumber());

      if (err.code === self.successCode) {
        self.onSuccess && self.onSuccess(connection, response);
        cb &&
          cb(
            null,
            self.parseResponse && self.parseResponse(response)
          );
      } else {
        const error: any = new Error(MsErref.getErrorMessage(err));
        error.code = err.code;
        cb && cb(error);
      }
    };
  },

  parseResponse(response: SMB2Message) {
    return response.getResponse();
  },
};

export default function message(obj: MessageConfig): MessageConfig {
  for (const key in defaults) {
    if (!(obj as any)[key]) {
      (obj as any)[key] = (defaults as any)[key];
    }
  }
  return obj;
}
