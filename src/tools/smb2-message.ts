import { SMB2MessageOptions, SMB2Headers, SMB2Structure, SMB2Connection } from '../types';
import { getStructure } from '../structures';

const protocolId = Buffer.from([0xfe, 'S'.charCodeAt(0), 'M'.charCodeAt(0), 'B'.charCodeAt(0)]);

const headerTranslates: { [key: string]: { [key: string]: number } } = {
  Command: {
    NEGOTIATE: 0x0000,
    SESSION_SETUP: 0x0001,
    LOGOFF: 0x0002,
    TREE_CONNECT: 0x0003,
    TREE_DISCONNECT: 0x0004,
    CREATE: 0x0005,
    CLOSE: 0x0006,
    FLUSH: 0x0007,
    READ: 0x0008,
    WRITE: 0x0009,
    LOCK: 0x000a,
    IOCTL: 0x000b,
    CANCEL: 0x000c,
    ECHO: 0x000d,
    QUERY_DIRECTORY: 0x000e,
    CHANGE_NOTIFY: 0x000f,
    QUERY_INFO: 0x0010,
    SET_INFO: 0x0011,
    OPLOCK_BREAK: 0x0012,
  },
};

const flags: { [key: string]: number } = {
  SERVER_TO_REDIR: 0x00000001,
  ASYNC_COMMAND: 0x00000002,
  RELATED_OPERATIONS: 0x00000004,
  SIGNED: 0x00000008,
  DFS_OPERATIONS: 0x10000000,
  REPLAY_OPERATION: 0x20000000,
};

const headerLength = 64;

type HeaderField = [string, number, Buffer | number | undefined] | [string, number];

function headerSync(processId: Buffer, sessionId: number): HeaderField[] {
  return [
    ['ProtocolId', 4, protocolId],
    ['StructureSize', 2, headerLength],
    ['CreditCharge', 2, 0],
    ['Status', 4, 0],
    ['Command', 2],
    ['Credit', 2, 126],
    ['Flags', 4, 0],
    ['NextCommand', 4, 0],
    ['MessageId', 4],
    ['MessageIdHigh', 4, 0],
    ['ProcessId', 4, processId],
    ['TreeId', 4, 0],
    ['SessionId', 8, sessionId],
    ['Signature', 16, 0],
  ];
}

function headerASync(processId: Buffer, sessionId: number): HeaderField[] {
  return [
    ['ProtocolId', 4, protocolId],
    ['StructureSize', 2, headerLength],
    ['CreditCharge', 2, 0],
    ['Status', 4, 0],
    ['Command', 2],
    ['Credit', 2, 126],
    ['Flags', 4, 0],
    ['NextCommand', 4, 0],
    ['MessageId', 4],
    ['MessageIdHigh', 4, 0],
    ['AsyncId', 8],
    ['SessionId', 8, sessionId],
    ['Signature', 16, 0],
  ];
}

function dataToBuffer(data: any, length: number): Buffer {
  if (Buffer.isBuffer(data)) {
    return data;
  }

  if (typeof data === 'string') {
    return Buffer.from(data);
  }

  const result = Buffer.alloc(length);
  for (let i = 0; i < length; i++) {
    result.writeUInt8(0xff & (data >> (i * 8)), i);
  }
  return result;
}

function bufferToData(buffer: Buffer | any): number {
  if (!Buffer.isBuffer(buffer)) {
    return buffer;
  }

  let result = 0;
  for (let i = 0; i < buffer.length; i++) {
    result += buffer.readUInt8(i) << (i * 8);
  }
  return result;
}

function writeData(buffer: Buffer, data: any, offset: number, length: number): void {
  dataToBuffer(data, length).copy(buffer, offset, 0);
}

function readData(buffer: Buffer, offset: number, length: number): Buffer {
  return buffer.slice(offset, offset + length);
}

function translate(key: string, value: any): any {
  if (headerTranslates[key] && typeof headerTranslates[key][value] !== 'undefined') {
    return headerTranslates[key][value];
  }
  return value;
}

function unTranslate(key: string, value: number): string | null {
  if (headerTranslates[key]) {
    for (const t in headerTranslates[key]) {
      if (headerTranslates[key][t] === value) {
        return t;
      }
    }
  }
  return null;
}

function readHeaders(message: SMB2Message, buffer: Buffer): void {
  const header = (message.isAsync ? headerASync : headerSync)(
    message.ProcessId,
    message.SessionId
  );
  let offset = 0;

  for (const i in header) {
    const key = header[i][0];
    const length = header[i][1];
    message.headers[key] = readData(buffer, offset, length);
    if (length <= 8) {
      message.headers[key] =
        unTranslate(key, bufferToData(message.headers[key])) || message.headers[key];
    }
    offset += length;
  }
  message.structure = getStructure((message.headers.Command as string).toLowerCase());
}

function writeHeaders(message: SMB2Message, buffer: Buffer): number {
  const header = (message.isAsync ? headerASync : headerSync)(
    message.ProcessId,
    message.SessionId
  );
  let offset = 0;

  for (const i in header) {
    const key = header[i][0];
    const length = header[i][1];
    const defaultValue = header[i][2] || 0;
    writeData(buffer, translate(key, message.headers[key] || defaultValue), offset, length);
    offset += length;
  }
  return offset;
}

function readResponse(message: SMB2Message, buffer: Buffer, offset: number): void {
  for (const i in message.structure.response) {
    const key = message.structure.response[i][0];
    let length: number | string = message.structure.response[i][1] || 1;
    if (typeof length === 'string') {
      length = bufferToData(message.response[length]);
    }
    message.response[key] = readData(buffer, offset, length as number);
    offset += length as number;
  }
}

function writeRequest(message: SMB2Message, buffer: Buffer, offset: number): number {
  const initOffset = offset;
  let needsRewrite = false;
  const tmpBuffer = Buffer.alloc(buffer.length);
  offset = 0;

  for (const i in message.structure.request) {
    const key = message.structure.request[i][0];
    let length: number | string = message.structure.request[i][1] || 1;
    const defaultValue = message.structure.request[i][2] || 0;

    if (typeof length === 'string') {
      message.request[key] = message.request[key] || '';
      if (message.request[length] !== message.request[key].length) {
        message.request[length] = message.request[key].length;
        needsRewrite = true;
      }
      length = message.request[key].length;
    } else {
      message.request[key] = message.request[key] || defaultValue;
    }
    writeData(tmpBuffer, message.request[key], offset, length as number);
    offset += length as number;
  }

  if (needsRewrite) {
    writeRequest(message, tmpBuffer, 0);
  }
  tmpBuffer.copy(buffer, initOffset, 0, offset);
  return offset;
}

export class SMB2Message {
  headers: SMB2Headers;
  request: any;
  response: any;
  structure!: SMB2Structure;
  isAsync: boolean;
  ProcessId!: Buffer;
  SessionId!: number;
  isMessageIdSetted: boolean;

  constructor(options?: SMB2MessageOptions) {
    this.headers = {};
    if (options && options.headers) {
      this.setHeaders(options.headers);
    }

    this.request = {};
    if (options && options.request) {
      this.setRequest(options.request);
    }

    this.response = {};
    this.isAsync = false;
    this.isMessageIdSetted = false;
  }

  setHeaders(obj: SMB2Headers): void {
    for (const key in obj) {
      (this.headers as any)[key] = (obj as any)[key];
    }
    this.structure = getStructure((this.headers.Command as string).toLowerCase());
  }

  getHeaders(): SMB2Headers {
    return this.headers;
  }

  setRequest(request: any): void {
    this.request = request;
  }

  getResponse(): any {
    return this.response;
  }

  getBuffer(connection: SMB2Connection): Buffer {
    const buffer = Buffer.alloc(0xffff);
    let length = 0;

    if (!this.isMessageIdSetted) {
      this.isMessageIdSetted = true;
      this.headers.MessageId = connection.messageId++;
    }

    length += writeHeaders(this, buffer);
    length += writeRequest(this, buffer, headerLength);

    const output = Buffer.alloc(length);
    buffer.copy(output, 0, 0, length);
    return output;
  }

  parseBuffer(buffer: Buffer): void {
    readHeaders(this, buffer);
    readResponse(this, buffer, headerLength);
  }
}

export default SMB2Message;
