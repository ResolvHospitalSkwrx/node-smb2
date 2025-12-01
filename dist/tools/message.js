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
exports.default = message;
const MsErref = __importStar(require("./ms_erref"));
const bigint_1 = __importDefault(require("./bigint"));
const defaults = {
    successCode: 'STATUS_SUCCESS',
    parse(connection, cb) {
        const self = this;
        return function (response) {
            const h = response.getHeaders();
            const err = MsErref.getStatus(bigint_1.default.fromBuffer(h.Status).toNumber());
            if (err.code === self.successCode) {
                self.onSuccess && self.onSuccess(connection, response);
                cb &&
                    cb(null, self.parseResponse && self.parseResponse(response));
            }
            else {
                const error = new Error(MsErref.getErrorMessage(err));
                error.code = err.code;
                cb && cb(error);
            }
        };
    },
    parseResponse(response) {
        return response.getResponse();
    },
};
function message(obj) {
    for (const key in defaults) {
        if (!obj[key]) {
            obj[key] = defaults[key];
        }
    }
    return obj;
}
//# sourceMappingURL=message.js.map