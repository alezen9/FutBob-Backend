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
const clean_deep_1 = __importDefault(require("clean-deep"));
const entities_1 = require("../../MongoDB/User/entities");
const mongodb_1 = require("mongodb");
const MongoDB_1 = require("../../MongoDB");
const ErrorMessages_1 = __importDefault(require("../../Utils/ErrorMessages"));
const User_1 = require("../../MongoDB/User");
const lodash_1 = require("lodash");
const moment_1 = __importDefault(require("moment"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const transform_1 = require("./transform");
const userResolver = {
    Query: {
        getUserConnected: (_, __, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!req.isAuth)
                throw new Error(ErrorMessages_1.default.user_unauthenticated);
            const user = yield User_1.mongoUser.getUser({ _id: req.idUser });
            if (!user)
                throw new Error(ErrorMessages_1.default.user_user_not_exists);
            return transform_1.gql_User(user);
        })
    },
    Mutation: {
        changePassword: (_, { oldPassword, newPassword }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!req.isAuth)
                throw new Error(ErrorMessages_1.default.user_unauthenticated);
            const areEqual = oldPassword === newPassword;
            if (areEqual)
                throw new Error(ErrorMessages_1.default.user_new_old_password_equal);
            const user = yield User_1.mongoUser.getUser({ _id: req.idUser });
            if (!user)
                throw new Error(ErrorMessages_1.default.user_user_not_exists);
            const isEqualOld = yield bcrypt_1.default.compare(oldPassword, user.credentials.password);
            if (!isEqualOld)
                throw new Error(ErrorMessages_1.default.user_password_not_correct);
            const encryptedNewPassword = yield User_1.mongoUser.encryptPassword(newPassword);
            yield MongoDB_1.MongoDBInstance.collection.user.updateOne({ _id: new mongodb_1.ObjectId(req.idUser) }, { $set: { 'credentials.password': encryptedNewPassword } }, { upsert: true });
            return true;
        }),
        changeUsername: (_, { newUsername }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!req.isAuth)
                throw new Error(ErrorMessages_1.default.user_unauthenticated);
            const existingNewUsername = yield MongoDB_1.MongoDBInstance.collection.user.findOne({ 'credentials.username': newUsername });
            if (existingNewUsername)
                throw new Error(ErrorMessages_1.default.user_username_already_exists);
            const { modifiedCount } = yield MongoDB_1.MongoDBInstance.collection.user.updateOne({ _id: new mongodb_1.ObjectId(req.idUser) }, { $set: { 'credentials.username': newUsername } });
            if (modifiedCount === 0)
                throw new Error(ErrorMessages_1.default.user_update_not_possible);
            transform_1.userLoader.clear(req.idUser);
            return true;
        }),
        updateUserConnected: (_, { userInput }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!req.isAuth)
                throw new Error(ErrorMessages_1.default.user_unauthenticated);
            const { name, surname, dateOfBirth, phone, email, sex, country } = userInput;
            if (lodash_1.isEmpty(clean_deep_1.default(userInput)))
                return true;
            const updatedUser = new entities_1.User();
            if (name)
                updatedUser.name = name;
            if (surname)
                updatedUser.surname = surname;
            if (dateOfBirth)
                updatedUser.dateOfBirth = moment_1.default(dateOfBirth).toDate();
            if (phone)
                updatedUser.phone = phone;
            if (email)
                updatedUser.email = email;
            if (sex)
                updatedUser.sex = sex;
            if (country)
                updatedUser.country = country;
            updatedUser.updatedAt = moment_1.default().toDate();
            const { modifiedCount } = yield MongoDB_1.MongoDBInstance.collection.user.updateOne({ _id: new mongodb_1.ObjectId(req.idUser) }, { $set: updatedUser });
            if (modifiedCount === 0)
                throw new Error(ErrorMessages_1.default.user_update_not_possible);
            transform_1.userLoader.clear(req.idUser);
            return true;
        }),
        updateUser: (_, { userInput }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!req.isAuth)
                throw new Error(ErrorMessages_1.default.user_unauthenticated);
            const { _id, name, surname, dateOfBirth, phone, email, sex, country } = userInput;
            if (lodash_1.isEmpty(clean_deep_1.default(userInput)))
                return true;
            const updatedUser = new entities_1.User();
            if (name)
                updatedUser.name = name;
            if (surname)
                updatedUser.surname = surname;
            if (dateOfBirth)
                updatedUser.dateOfBirth = moment_1.default(dateOfBirth).toDate();
            if (phone)
                updatedUser.phone = phone;
            if (email)
                updatedUser.email = email;
            if (sex)
                updatedUser.sex = sex;
            if (country)
                updatedUser.country = country;
            updatedUser.updatedAt = moment_1.default().toDate();
            const { modifiedCount } = yield MongoDB_1.MongoDBInstance.collection.user.updateOne({ _id: new mongodb_1.ObjectId(_id) }, { $set: updatedUser });
            if (modifiedCount === 0)
                throw new Error(ErrorMessages_1.default.user_update_not_possible);
            transform_1.userLoader.clear(_id);
            return true;
        })
    }
};
exports.default = userResolver;
//# sourceMappingURL=user.js.map