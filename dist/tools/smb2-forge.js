"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMB2Forge = void 0;
const smb2_message_1 = __importDefault(require("./smb2-message"));
exports.SMB2Forge = {
    request(messageName, params, connection, cb) {
        const msg = require('../messages/' + messageName);
        const smbMessage = msg.generate(connection, params);
        sendNetBiosMessage(connection, smbMessage);
        getResponse(connection, smbMessage.getHeaders().MessageId, msg.parse(connection, cb));
    },
    response(c) {
        c.responses = {};
        c.responsesCB = {};
        c.responseBuffer = Buffer.alloc(0);
        return function (response) {
            c.responseBuffer = Buffer.concat([c.responseBuffer, response]);
            let extract = true;
            while (extract) {
                extract = false;
                if (c.responseBuffer.length >= 4) {
                    const msgLength = (c.responseBuffer.readUInt8(1) << 16) + c.responseBuffer.readUInt16BE(2);
                    if (c.responseBuffer.length >= msgLength + 4) {
                        extract = true;
                        const r = c.responseBuffer.slice(4, msgLength + 4);
                        const message = new smb2_message_1.default();
                        message.parseBuffer(r);
                        if (c.debug) {
                            console.log('--response');
                            console.log(r.toString('hex'));
                        }
                        const mId = message.getHeaders().MessageId.toString('hex');
                        if (c.responsesCB[mId]) {
                            c.responsesCB[mId](message);
                            delete c.responsesCB[mId];
                        }
                        else {
                            c.responses[mId] = message;
                        }
                        c.responseBuffer = c.responseBuffer.slice(msgLength + 4);
                    }
                }
            }
        };
    },
};
function sendNetBiosMessage(connection, message) {
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
function getResponse(c, mId, cb) {
    const messageId = Buffer.alloc(4);
    messageId.writeUInt32LE(mId, 0);
    const messageIdHex = messageId.toString('hex');
    if (c.responses[messageIdHex]) {
        cb(c.responses[messageIdHex]);
        delete c.responses[messageIdHex];
    }
    else {
        c.responsesCB[messageIdHex] = cb;
    }
}
exports.default = exports.SMB2Forge;
//# sourceMappingURL=smb2-forge.js.map