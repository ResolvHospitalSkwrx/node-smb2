import SMB2Forge from '../tools/smb2-forge';
import BigInt from '../tools/bigint';
import { ExtendedConnection } from '../tools/smb2-connection';
import { SMB2Callback } from '../types';

const SMB2Request = SMB2Forge.request;

export interface WriteFileOptions {
  encoding?: BufferEncoding;
}

export default function writeFile(
  this: ExtendedConnection,
  filename: string,
  data: string | Buffer,
  options: WriteFileOptions | SMB2Callback,
  cb?: SMB2Callback
): void {
  let opts: WriteFileOptions = {};

  if (typeof options === 'function') {
    cb = options;
    opts = {};
  } else {
    opts = options;
  }

  opts.encoding = opts.encoding || 'utf8';

  const connection = this;
  let file: any;
  const fileContent = Buffer.isBuffer(data) ? data : Buffer.from(data, opts.encoding);
  const fileLength = new BigInt(8, fileContent.length);

  function createFile(fileCreated: () => void) {
    SMB2Request('create', { path: filename }, connection, (err, f) => {
      if (err) cb && cb(err);
      else {
        file = f;
        fileCreated();
      }
    });
  }

  function closeFile(fileClosed: SMB2Callback) {
    SMB2Request('close', file, connection, (err) => {
      if (err) cb && cb(err);
      else {
        file = null;
        fileClosed && fileClosed(null);
      }
    });
  }

  function setFileSize(fileSizeSetted: () => void) {
    SMB2Request(
      'set_info',
      {
        FileId: file.FileId,
        FileInfoClass: 'FileEndOfFileInformation',
        Buffer: fileLength.toBuffer(),
      },
      connection,
      (err) => {
        if (err) cb && cb(err);
        else fileSizeSetted();
      }
    );
  }

  function writeFileContent(fileWritten: () => void) {
    let offset = new BigInt(8);
    let stop = false;
    let nbRemainingPackets = 0;
    const maxPacketSize = new BigInt(8, 0x00010000 - 0x71);

    function callback(offset: BigInt) {
      return function (err: Error | null) {
        if (stop) return;
        if (err) {
          cb && cb(err);
          stop = true;
        } else {
          nbRemainingPackets--;
          checkDone();
        }
      };
    }

    function checkDone() {
      if (stop) return;
      createPackets();
      if (nbRemainingPackets === 0 && offset.ge(fileLength)) {
        fileWritten();
      }
    }

    function createPackets() {
      while (nbRemainingPackets < connection.packetConcurrency && offset.lt(fileLength)) {
        const rest = fileLength.sub(offset);
        const packetSize = rest.gt(maxPacketSize) ? maxPacketSize : rest;
        SMB2Request(
          'write',
          {
            FileId: file.FileId,
            Offset: offset.toBuffer(),
            Buffer: fileContent.slice(offset.toNumber(), offset.add(packetSize).toNumber()),
          },
          connection,
          callback(offset)
        );
        offset = offset.add(packetSize);
        nbRemainingPackets++;
      }
    }
    checkDone();
  }

  createFile(() => {
    setFileSize(() => {
      writeFileContent(() => {
        closeFile(cb!);
      });
    });
  });
}
