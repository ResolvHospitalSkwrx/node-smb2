"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = writeFile;
const smb2_forge_1 = __importDefault(require("../tools/smb2-forge"));
const bigint_1 = __importDefault(require("../tools/bigint"));
const SMB2Request = smb2_forge_1.default.request;
function writeFile(filename, data, options, cb) {
    let opts = {};
    if (typeof options === 'function') {
        cb = options;
        opts = {};
    }
    else {
        opts = options;
    }
    opts.encoding = opts.encoding || 'utf8';
    const connection = this;
    let file;
    const fileContent = Buffer.isBuffer(data) ? data : Buffer.from(data, opts.encoding);
    const fileLength = new bigint_1.default(8, fileContent.length);
    function createFile(fileCreated) {
        SMB2Request('create', { path: filename }, connection, (err, f) => {
            if (err)
                cb && cb(err);
            else {
                file = f;
                fileCreated();
            }
        });
    }
    function closeFile(fileClosed) {
        SMB2Request('close', file, connection, (err) => {
            if (err)
                cb && cb(err);
            else {
                file = null;
                fileClosed && fileClosed(null);
            }
        });
    }
    function setFileSize(fileSizeSetted) {
        SMB2Request('set_info', {
            FileId: file.FileId,
            FileInfoClass: 'FileEndOfFileInformation',
            Buffer: fileLength.toBuffer(),
        }, connection, (err) => {
            if (err)
                cb && cb(err);
            else
                fileSizeSetted();
        });
    }
    function writeFileContent(fileWritten) {
        let offset = new bigint_1.default(8);
        let stop = false;
        let nbRemainingPackets = 0;
        const maxPacketSize = new bigint_1.default(8, 0x00010000 - 0x71);
        function callback(offset) {
            return function (err) {
                if (stop)
                    return;
                if (err) {
                    cb && cb(err);
                    stop = true;
                }
                else {
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
                fileWritten();
            }
        }
        function createPackets() {
            while (nbRemainingPackets < connection.packetConcurrency && offset.lt(fileLength)) {
                const rest = fileLength.sub(offset);
                const packetSize = rest.gt(maxPacketSize) ? maxPacketSize : rest;
                SMB2Request('write', {
                    FileId: file.FileId,
                    Offset: offset.toBuffer(),
                    Buffer: fileContent.slice(offset.toNumber(), offset.add(packetSize).toNumber()),
                }, connection, callback(offset));
                offset = offset.add(packetSize);
                nbRemainingPackets++;
            }
        }
        checkDone();
    }
    createFile(() => {
        setFileSize(() => {
            writeFileContent(() => {
                closeFile(cb);
            });
        });
    });
}
//# sourceMappingURL=writefile.js.map