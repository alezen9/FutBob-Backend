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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../MongoDB/User");
const Entities_1 = require("../../MongoDB/Entities");
const bcrypt_1 = __importDefault(require("bcrypt"));
const ErrorMessages_1 = __importDefault(require("../../Utils/ErrorMessages"));
const entities_1 = require("../../MongoDB/User/entities");
const MongoDB_1 = require("../../MongoDB");
const mongodb_1 = require("mongodb");
const authResolver = {
    Query: {
        login: (_, { signinInput }) => __awaiter(void 0, void 0, void 0, function* () {
            const { username, password } = signinInput;
            const user = yield MongoDB_1.MongoDBInstance.collection.user.findOne({ 'credentials.username': username });
            if (!user)
                throw new Error(ErrorMessages_1.default.user_not_exists);
            const isEqual = yield bcrypt_1.default.compare(password, user.credentials.password);
            if (!isEqual)
                throw new Error(ErrorMessages_1.default.password_not_correct);
            const tokenData = {
                idUser: user._id.toHexString(),
                privileges: user.privileges
            };
            const token = User_1.mongoUser.generateJWT(tokenData);
            return {
                token,
                expiresIn: User_1.mongoUser.tokenExpiration
            };
        }),
        getUserConnected: (_, __, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!req.isAuth)
                throw new Error(ErrorMessages_1.default.unauthenticated);
            const user = yield User_1.mongoUser.getUserById(req.idUser);
            if (!user)
                throw new Error(ErrorMessages_1.default.user_not_exists);
            return User_1.mongoUser.getTypeUserFields(user);
        })
    },
    Mutation: {
        signup: (_, { signupInput }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const idUser = yield User_1.mongoUser.createUser(signupInput);
                const tokenData = {
                    idUser,
                    privileges: [Entities_1.Privilege.Manager]
                };
                const token = User_1.mongoUser.generateJWT(tokenData);
                return {
                    token,
                    expiresIn: User_1.mongoUser.tokenExpiration
                };
            }
            catch (error) {
                throw error;
            }
        }),
        changePassword: (_, { oldPassword, newPassword }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!req.isAuth)
                throw new Error(ErrorMessages_1.default.unauthenticated);
            const user = yield User_1.mongoUser.getUserById(req.idUser);
            if (!user)
                throw new Error(ErrorMessages_1.default.user_not_exists);
            const isEqual = yield bcrypt_1.default.compare(oldPassword, user.credentials.password);
            if (!isEqual)
                throw new Error(ErrorMessages_1.default.password_not_correct);
            const encryptedNewPassword = User_1.mongoUser.encryptPassword(newPassword);
            MongoDB_1.MongoDBInstance.collection.user.updateOne({ _id: new mongodb_1.ObjectId(req.idUser) }, { $set: { 'credentials.password': encryptedNewPassword } }, { upsert: true });
            return true;
        }),
        changeUsername: (_, { newUsername }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!req.isAuth)
                throw new Error(ErrorMessages_1.default.unauthenticated);
            const existingNewUsername = yield MongoDB_1.MongoDBInstance.collection.user.findOne({ 'credentials.username': newUsername });
            if (existingNewUsername)
                throw new Error(ErrorMessages_1.default.username_already_exists);
            MongoDB_1.MongoDBInstance.collection.user.updateOne({ _id: new mongodb_1.ObjectId(req.idUser) }, { $set: { 'credentials.username': newUsername } }, { upsert: true });
            return true;
        }),
        updateUserConnected: (_, { userInput }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!req.isAuth)
                throw new Error(ErrorMessages_1.default.unauthenticated);
            const { name, surname, dateOfBirth, phone, email, sex } = userInput;
            const updatedUser = new entities_1.User();
            if (name)
                updatedUser.name = name;
            if (surname)
                updatedUser.surname = surname;
            if (dateOfBirth)
                updatedUser.dateOfBirth = dateOfBirth;
            if (phone)
                updatedUser.phone = phone;
            if (email)
                updatedUser.email = email;
            if (sex)
                updatedUser.sex = sex;
            MongoDB_1.MongoDBInstance.collection.user.updateOne({ _id: new mongodb_1.ObjectId(req.idUser) }, { $set: updatedUser }, { upsert: true });
            return true;
        }),
    }
};
exports.default = authResolver;
//# sourceMappingURL=auth.js.map