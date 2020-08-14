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
const helpers_1 = require("../../Utils/helpers");
class MongoUser {
    constructor() {
        this.tokenExpiration = '3h';
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.username && data.password) {
                const res = yield this.getUser({ username: data.username });
                if (res)
                    throw new Error(ErrorMessages_1.default.user_username_already_exists);
            }
            const now = moment_1.default().toDate();
            const user = new entities_1.User();
            user._id = new mongodb_1.ObjectId();
            user.name = data.name;
            user.surname = data.surname;
            user.createdAt = now;
            user.updatedAt = now;
            user.dateOfBirth = moment_1.default(data.dateOfBirth).toDate();
            user.sex = data.sex;
            user.phone = data.phone;
            user.privileges = [data.privilege || Entities_1.Privilege.Manager];
            if (data.email)
                user.email = data.email;
            if (data.username && data.password) {
                const credentials = new entities_1.Credentials();
                credentials.username = data.username;
                const encryptedPassword = yield this.encryptPassword(data.password);
                credentials.password = encryptedPassword;
                user.credentials = credentials;
            }
            yield __1.MongoDBInstance.collection.user.insertOne(user);
            return user._id.toHexString();
        });
    }
    getUser(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield __1.MongoDBInstance.collection.user.findOne(Object.assign(Object.assign({}, params._id && { _id: new mongodb_1.ObjectId(params._id) }), params.username && { 'credentials.username': params.username }));
            return user;
        });
    }
    assignPlayer(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateUser = new entities_1.User();
            if (params.footballPlayer)
                updateUser.footballPlayer = new mongodb_1.ObjectId(params.footballPlayer);
            if (params.futsalPlayer)
                updateUser.futsalPlayer = new mongodb_1.ObjectId(params.futsalPlayer);
            yield __1.MongoDBInstance.collection.user.updateOne({ _id: new mongodb_1.ObjectId(params.idUser) }, { $set: updateUser }, { upsert: true });
            return true;
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
        const { credentials, _id, futsalPlayer, footballPlayer, dateOfBirth, createdAt, updatedAt } = user, rest = __rest(user, ["credentials", "_id", "futsalPlayer", "footballPlayer", "dateOfBirth", "createdAt", "updatedAt"]);
        return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, rest), { _id: _id.toHexString() }), credentials && credentials.username && { username: credentials.username }), helpers_1.ISODates({ dateOfBirth, createdAt, updatedAt })), futsalPlayer && { futsalPlayer: futsalPlayer.toHexString() }), footballPlayer && { footballPlayer: footballPlayer.toHexString() });
    }
    generateJWT(data) {
        const token = jsonwebtoken_1.default.sign(Object.assign({}, data), process.env.SECRET);
        return token;
    }
}
exports.mongoUser = new MongoUser();
//# sourceMappingURL=index.js.map