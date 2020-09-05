"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncTimeout = exports.ISODates = exports.paramsToString = exports.lowerCaseFirst = exports.generateJWT = exports.capitalize = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const lodash_1 = require("lodash");
const moment_1 = __importDefault(require("moment"));
exports.capitalize = (str) => {
    return `${str.substr(0, 1).toUpperCase()}${str.substr(1).toLowerCase()}`;
};
exports.generateJWT = data => {
    const { expires_in: expiresIn } = data, rest = __rest(data, ["expires_in"]);
    const expiresWithSpan = expiresIn - 60;
    const token = jwt.sign(rest, process.env.SECRET, {
        expiresIn: `${expiresWithSpan}s`
    });
    const refreshToken = jwt.sign(token, process.env.SECRET);
    return { tokenExpiration: expiresWithSpan, token, refreshToken };
};
exports.lowerCaseFirst = (str) => {
    const [first, ...rest] = str.split('');
    return [
        first.toLowerCase(),
        ...rest
    ].join('');
};
exports.paramsToString = params => {
    let str = '';
    for (const key in params) {
        if (lodash_1.isObject(params[key])) {
            if (params[key] instanceof Array)
                str += key + ':' + '[' + params[key].map(el => isNaN(el) ? `"${el}"` : el) + ']' + ', ';
            else
                str += key + ':' + exports.paramsToString(params[key]) + ', ';
        }
        else if (isNaN(params[key]))
            str += key + ':"' + params[key] + '", ';
        else
            str += key + ':' + params[key] + ', ';
    }
    return `{${str.slice(0, -2)}}`;
};
exports.ISODates = params => lodash_1.reduce(params, (acc, val, key) => {
    return Object.assign(Object.assign({}, acc), { [key]: moment_1.default(Number(val)).toISOString() });
}, {});
exports.asyncTimeout = (milliseconds, log = false) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, _) => {
        if (log)
            console.log(`Attendo ${milliseconds / 1000} secondi...`);
        setTimeout(() => resolve(), milliseconds);
    });
});
//# sourceMappingURL=helpers.js.map