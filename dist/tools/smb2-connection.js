"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMB2Connection = void 0;
const net = __importStar(require("net"));
const smb2_forge_1 = __importDefault(require("./smb2-forge"));
const SMB2Request = smb2_forge_1.default.request;
exports.SMB2Connection = {
    close(connection) {
        clearAutoCloseTimeout(connection);
        if (connection.connected) {
            connection.connected = false;
            connection.socket.end();
        }
    },
    requireConnect(method) {
        return function (...args) {
            const connection = this;
            connect(connection, (err) => {
                let cb = args.pop();
                cb = scheduleAutoClose(connection, cb);
                args.push(cb);
                if (err)
                    cb(err);
                else
                    method.apply(connection, args);
            });
        };
    },
    init(connection) {
        connection.connected = false;
        connection.socket = new net.Socket({
            allowHalfOpen: true,
        });
        connection.socket.on('data', smb2_forge_1.default.response(connection));
        connection.errorHandler = [];
        connection.socket.on('error', (err) => {
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
function connect(connection, cb) {
    if (connection.connected) {
        cb && cb(null);
        return;
    }
    cb = scheduleAutoClose(connection, cb);
    connection.socket.connect(connection.port, connection.ip);
    SMB2Request('negotiate', {}, connection, (err) => {
        if (err)
            cb && cb(err);
        else
            SMB2Request('session_setup_step1', {}, connection, (err) => {
                if (err)
                    cb && cb(err);
                else
                    SMB2Request('session_setup_step2', {}, connection, (err) => {
                        if (err)
                            cb && cb(err);
                        else
                            SMB2Request('tree_connect', {}, connection, (err) => {
                                if (err)
                                    cb && cb(err);
                                else {
                                    connection.connected = true;
                                    cb && cb(null);
                                }
                            });
                    });
            });
    });
}
function clearAutoCloseTimeout(connection) {
    if (connection.scheduledAutoClose) {
        clearTimeout(connection.scheduledAutoClose);
        connection.scheduledAutoClose = null;
    }
}
function setAutoCloseTimeout(connection) {
    clearAutoCloseTimeout(connection);
    if (connection.autoCloseTimeout !== 0) {
        connection.scheduledAutoClose = setTimeout(() => {
            connection.close();
        }, connection.autoCloseTimeout);
    }
}
function scheduleAutoClose(connection, cb) {
    addErrorListener(connection, cb);
    clearAutoCloseTimeout(connection);
    return function (...args) {
        removeErrorListener(connection);
        setAutoCloseTimeout(connection);
        cb.apply(null, args);
    };
}
function addErrorListener(connection, callback) {
    connection.errorHandler.unshift(callback);
}
function removeErrorListener(connection) {
    connection.errorHandler.shift();
}
exports.default = exports.SMB2Connection;
//# sourceMappingURL=smb2-connection.js.map