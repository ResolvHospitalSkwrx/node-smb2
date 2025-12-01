import * as net from 'net';
import SMB2Forge from './smb2-forge';
import { SMB2Connection as SMB2Conn, SMB2Callback } from '../types';

const SMB2Request = SMB2Forge.request;

export interface ExtendedConnection extends SMB2Conn {
  scheduledAutoClose?: NodeJS.Timeout | null;
  close: () => void;
}

export const SMB2Connection = {
  close(connection: ExtendedConnection): void {
    clearAutoCloseTimeout(connection);
    if (connection.connected) {
      connection.connected = false;
      connection.socket.end();
    }
  },

  requireConnect<T extends any[]>(
    method: (this: ExtendedConnection, ...args: [...T, SMB2Callback]) => void
  ): (this: ExtendedConnection, ...args: [...T, SMB2Callback]) => void {
    return function (this: ExtendedConnection, ...args: any[]) {
      const connection = this;
      connect(connection, (err) => {
        let cb = args.pop() as SMB2Callback;
        cb = scheduleAutoClose(connection, cb);
        args.push(cb);

        if (err) cb(err);
        else method.apply(connection, args as any);
      });
    };
  },

  init(connection: ExtendedConnection): void {
    connection.connected = false;
    connection.socket = new net.Socket({
      allowHalfOpen: true,
    });

    connection.socket.on('data', SMB2Forge.response(connection));
    connection.errorHandler = [];
    connection.socket.on('error', (err: Error) => {
      if (connection.errorHandler.length > 0) {
        connection.errorHandler[0].call(null, err);
      }
      if (connection.debug) {
        console.log('-- error');
        console.log(err);
      }
    });
  },
};

function connect(connection: ExtendedConnection, cb: SMB2Callback): void {
  if (connection.connected) {
    cb && cb(null);
    return;
  }

  cb = scheduleAutoClose(connection, cb);

  connection.socket.connect(connection.port, connection.ip);

  SMB2Request('negotiate', {}, connection, (err) => {
    if (err) cb && cb(err);
    else
      SMB2Request('session_setup_step1', {}, connection, (err) => {
        if (err) cb && cb(err);
        else
          SMB2Request('session_setup_step2', {}, connection, (err) => {
            if (err) cb && cb(err);
            else
              SMB2Request('tree_connect', {}, connection, (err) => {
                if (err) cb && cb(err);
                else {
                  connection.connected = true;
                  cb && cb(null);
                }
              });
          });
      });
  });
}

function clearAutoCloseTimeout(connection: ExtendedConnection): void {
  if (connection.scheduledAutoClose) {
    clearTimeout(connection.scheduledAutoClose);
    connection.scheduledAutoClose = null;
  }
}

function setAutoCloseTimeout(connection: ExtendedConnection): void {
  clearAutoCloseTimeout(connection);
  if (connection.autoCloseTimeout !== 0) {
    connection.scheduledAutoClose = setTimeout(() => {
      connection.close();
    }, connection.autoCloseTimeout);
  }
}

function scheduleAutoClose(connection: ExtendedConnection, cb: SMB2Callback): SMB2Callback {
  addErrorListener(connection, cb);
  clearAutoCloseTimeout(connection);
  return function (...args: any[]) {
    removeErrorListener(connection);
    setAutoCloseTimeout(connection);
    (cb as any).apply(null, args);
  };
}

function addErrorListener(connection: ExtendedConnection, callback: SMB2Callback): void {
  connection.errorHandler.unshift(callback as any);
}

function removeErrorListener(connection: ExtendedConnection): void {
  connection.errorHandler.shift();
}

export default SMB2Connection;
