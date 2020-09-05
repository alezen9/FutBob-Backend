"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPrivileges = void 0;
const Entities_1 = require("../MongoDB/Entities");
const ErrorMessages_1 = __importDefault(require("../Utils/ErrorMessages"));
const jwt = require('jsonwebtoken');
const isAuthMiddleware = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const [protocol, token] = authHeader.split(' ');
    if (!token || token === '' || !protocol || protocol !== 'Bearer') {
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err)
                throw err;
            return decoded;
        });
    }
    catch (err) {
        req.isAuth = false;
        req.authErr = err.name;
        return next();
    }
    if (!decodedToken) {
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.idUser = decodedToken.idUser;
    req.privileges = decodedToken.privileges;
    return next();
};
exports.checkPrivileges = (req, params) => {
    if (!(req.privileges.includes(Entities_1.Privilege.Manager) || req.privileges.includes(Entities_1.Privilege.Developer))) {
        throw new Error(ErrorMessages_1.default.system_permission_denied);
    }
};
exports.default = isAuthMiddleware;
//# sourceMappingURL=isAuth.js.map