"use strict";
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
exports.mongoUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const entities_1 = require("./entities");
const __1 = require("..");
const mongodb_1 = require("mongodb");
const Entities_1 = require("../Entities");
const ErrorMessages_1 = __importDefault(require("../../Utils/ErrorMessages"));
class MongoUser {
    constructor() {
        this.tokenExpiration = '3h';
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield __1.MongoDBInstance.collection.user.findOne({ 'credentials.username': data.username });
            if (res)
                throw new Error(ErrorMessages_1.default.username_already_exists);
            const now = moment_1.default().toISOString();
            const user = new entities_1.User();
            user._id = new mongodb_1.ObjectId();
            user.name = data.name;
            user.surname = data.surname;
            user.createdAt = now;
            user.updatedAt = now;
            user.dateOfBirth = data.dateOfBirth;
            user.sex = data.sex;
            user.phone = data.phone;
            user.privileges = data.privilege || Entities_1.Privilege.Manager;
            if (data.email)
                user.email = data.email;
            const credentials = new entities_1.Credentials();
            credentials.username = data.username;
            const encryptedPassword = yield this.encryptPassword(data.password);
            credentials.password = encryptedPassword;
            user.credentials = credentials;
            yield __1.MongoDBInstance.collection.user.insertOne(user);
            return user._id.toHexString();
        });
    }
    getUserById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield __1.MongoDBInstance.collection.user.findOne({ _id: new mongodb_1.ObjectId(_id) });
            return user;
        });
    }
    encryptPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(+process.env.HASH_SALT);
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            return hashedPassword;
        });
    }
    getTypeUserFields(user) {
        const { credentials, _id } = user, rest = __rest(user, ["credentials", "_id"]);
        return Object.assign(Object.assign({}, rest), { _id: _id.toHexString(), username: credentials.username });
    }
    generateJWT(data) {
        const token = jsonwebtoken_1.default.sign(Object.assign({}, data), process.env.SECRET, { expiresIn: this.tokenExpiration });
        return token;
    }
}
exports.mongoUser = new MongoUser();
//# sourceMappingURL=index.js.map