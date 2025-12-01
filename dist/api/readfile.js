"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = readFile;
const smb2_forge_1 = __importDefault(require("../tools/smb2-forge"));
const bigint_1 = __importDefault(require("../tools/bigint"));
const SMB2Request = smb2_forge_1.default.request;
function readFile(filename, options, cb) {
    const connection = this;
    let opts = {};
    if (typeof options === 'function') {
        cb = options;
        opts = {};
    }
    else {
        opts = options;
    }
    SMB2Request('open', { path: filename }, connection, (err, file) => {
        if (err)
            cb && cb(err);
        else {
            let fileLength = 0;
            let offset = new bigint_1.default(8);
            let stop = false;
            let nbRemainingPackets = 0;
            const maxPacketSize = 0x00010000;
            for (let i = 0; i < file.EndofFile.length; i++) {
                fileLength |= file.EndofFile[i] << (i * 8);
            }
            const result = Buffer.alloc(fileLength);
            function callback(offset) {
                return function (err, content) {
                    if (stop)
                        return;
                    if (err) {
                        cb && cb(err);
                        stop = true;
                    }
                    else {
                        content.copy(result, offset.toNumber());
                        nbRemainingPackets--;
                        checkDone();
                    }
                };
            }
            function checkDone() {
                if (stop)
                    return;
                createPackets();
                if (nbRemainingPackets === 0 && offset.ge(fileLength)) {
                    SMB2Request('close', file, connection, (err) => {
                        let finalResult = result;
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
                    SMB2Request('read', {
                        FileId: file.FileId,
                        Length: packetSize,
                        Offset: offset.toBuffer(),
                    }, connection, callback(offset));
                    offset = offset.add(packetSize);
                    nbRemainingPackets++;
                }
            }
            checkDone();
        }
    });
}
//# sourceMappingURL=readfile.js.map