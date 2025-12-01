import SMB2Forge from '../tools/smb2-forge';
import BigInt from '../tools/bigint';
import { ExtendedConnection } from '../tools/smb2-connection';
import { SMB2Callback, ReadFileOptions } from '../types';

const SMB2Request = SMB2Forge.request;

export default function readFile(
  this: ExtendedConnection,
  filename: string,
  options: ReadFileOptions | SMB2Callback,
  cb?: SMB2Callback<Buffer | string>
): void {
  const connection = this;
  let opts: ReadFileOptions = {};

  if (typeof options === 'function') {
    cb = options;
    opts = {};
  } else {
    opts = options;
  }

  SMB2Request('open', { path: filename }, connection, (err, file) => {
    if (err) cb && cb(err);
    else {
      let fileLength = 0;
      let offset = new BigInt(8);
      let stop = false;
      let nbRemainingPackets = 0;
      const maxPacketSize = 0x00010000;

      for (let i = 0; i < file.EndofFile.length; i++) {
        fileLength |= file.EndofFile[i] << (i * 8);
      }
      const result = Buffer.alloc(fileLength);

      function callback(offset: BigInt) {
        return function (err: Error | null, content: Buffer) {
          if (stop) return;
          if (err) {
            cb && cb(err);
            stop = true;
          } else {
            content.copy(result, offset.toNumber());
            nbRemainingPackets--;
            checkDone();
          }
        };
      }

      function checkDone() {
        if (stop) return;
        createPackets();
        if (nbRemainingPackets === 0 && offset.ge(fileLength)) {
          SMB2Request('close', file, connection, (err) => {
            let finalResult: Buffer | string = result;
            if (opts.encoding) {
              finalResult = result.toString(opts.encoding);
            }
            cb && cb(null, finalResult);
          });
        }
      }

      function createPackets() {
        while (nbRemainingPackets < connection.packetConcurrency && offset.lt(fileLength)) {
          const rest = offset.sub(fileLength).neg();
          const packetSize = rest.gt(maxPacketSize) ? maxPacketSize : rest.toNumber();
          SMB2Request(
            'read',
            {
              FileId: file.FileId,
              Length: packetSize,
              Offset: offset.toBuffer(),
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
  });
}
