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
Object.defineProperty(exports, "__esModule", { value: true });
exports.paramsToString = exports.lowerCaseFirst = exports.generateJWT = exports.capitalize = void 0;
const jwt = __importStar(require("jsonwebtoken"));
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
        if (isNaN(params[key]))
            str += key + ':"' + params[key] + '", ';
        else
            str += key + ':' + params[key] + ', ';
    }
    return `{${str.slice(0, -2)}}`;
};
//# sourceMappingURL=helpers.js.map