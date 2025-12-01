import SMB2Connection, { ExtendedConnection } from './tools/smb2-connection';
import { SMB2Options, SMB2Callback } from './types';
import close from './api/close';
import exists from './api/exists';
import mkdir from './api/mkdir';
import readdir from './api/readdir';
import readFile from './api/readfile';
import rename from './api/rename';
import rmdir from './api/rmdir';
import unlink from './api/unlink';
import writeFile from './api/writefile';

const shareRegExp = /\\\\([^\\]*)\\([^\\]*)\\?/;
const port = 445;
const packetConcurrency = 20;
const autoCloseTimeout = 10000;

export class SMB2 implements ExtendedConnection {
  ip: string;
  port: number;
  messageId: number;
  share: string;
  fullPath: string;
  packetConcurrency: number;
  autoCloseTimeout: number;
  domain?: string;
  username?: string;
  password?: string;
  SessionId: number;
  ProcessId: Buffer;
  debug?: boolean;
  connected: boolean;
  socket: any;
  errorHandler: Array<(err: Error) => void>;
  responses: { [key: string]: any };
  responsesCB: { [key: string]: (message: any) => void };
  responseBuffer: Buffer;
  newResponse?: boolean;
  scheduledAutoClose?: NodeJS.Timeout | null;
  TreeId?: any;
  nonce?: any;

  constructor(opt: SMB2Options) {
    const matches = opt.share.match(shareRegExp);
    if (!matches) {
      throw new Error('the share is not valid');
    }

    this.ip = matches[1];
    this.port = opt.port || port;
    this.messageId = 0;
    this.share = matches[2];
    this.fullPath = opt.share;
    this.packetConcurrency = opt.packetConcurrency || packetConcurrency;

    if (opt.autoCloseTimeout !== undefined) {
      this.autoCloseTimeout = opt.autoCloseTimeout;
    } else {
      this.autoCloseTimeout = autoCloseTimeout;
    }

    this.domain = opt.domain;
    this.username = opt.username;
    this.password = opt.password;

    this.SessionId = Math.floor(Math.random() * 256) & 0xff;

    this.ProcessId = Buffer.from([
      Math.floor(Math.random() * 256) & 0xff,
      Math.floor(Math.random() * 256) & 0xff,
      Math.floor(Math.random() * 256) & 0xff,
      Math.floor(Math.random() * 256) & 0xfe,
    ]);

    this.debug = opt.debug;

    this.connected = false;
    this.socket = null;
    this.errorHandler = [];
    this.responses = {};
    this.responsesCB = {};
    this.responseBuffer = Buffer.alloc(0);

    SMB2Connection.init(this);
  }

  close = close;
  exists = SMB2Connection.requireConnect(exists);
  rename = SMB2Connection.requireConnect(rename);
  readFile = SMB2Connection.requireConnect(readFile);
  writeFile = SMB2Connection.requireConnect(writeFile);
  unlink = SMB2Connection.requireConnect(unlink);
  readdir = SMB2Connection.requireConnect(readdir);
  rmdir = SMB2Connection.requireConnect(rmdir);
  mkdir = SMB2Connection.requireConnect(mkdir);
}

export default SMB2;
