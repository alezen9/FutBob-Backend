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
const authResolver = {
    Query: {
        login: (_, { signinInput }) => __awaiter(void 0, void 0, void 0, function* () {
            const { username, password } = signinInput;
            const user = yield User_1.mongoUser.getUser({ username });
            if (!user)
                throw new Error(ErrorMessages_1.default.user_user_not_exists);
            const isEqual = yield bcrypt_1.default.compare(password, user.credentials.password);
            if (!isEqual)
                throw new Error(ErrorMessages_1.default.user_password_not_correct);
            const tokenData = {
                idUser: user._id.toHexString(),
                privileges: user.privileges
            };
            const token = User_1.mongoUser.generateJWT(tokenData);
            return {
                token,
                expiresIn: User_1.mongoUser.tokenExpiration
            };
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
        })
    }
};
exports.default = authResolver;
//# sourceMappingURL=auth.js.map