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
const assert_1 = __importDefault(require("assert"));
const MongoDB_1 = require("../MongoDB");
const SDK_1 = require("../SDK");
const mocha_1 = require("mocha");
const helpers_1 = require("./helpers");
const entities_1 = require("../MongoDB/User/entities");
const ErrorMessages_1 = __importDefault(require("../Utils/ErrorMessages"));
const moment_1 = __importDefault(require("moment"));
const apiInstance = new SDK_1.FutBobServer();
const noTokenApiInstance = new SDK_1.FutBobServer();
const managerCredentials = {
    username: 'alezen9',
    password: 'alezen9'
};
const manager = Object.assign({ name: 'Aleksandar', surname: 'Gjroeski', dateOfBirth: '1993-07-02T22:00:00.000Z', phone: '+39 1234567890', sex: entities_1.Sex.Male }, managerCredentials);
const authDataFields = `{
  token,
  expiresIn
}`;
mocha_1.describe('Authentication', () => {
    mocha_1.describe('Clear database', () => {
        mocha_1.it('Should clear database', () => __awaiter(void 0, void 0, void 0, function* () {
            if (MongoDB_1.MongoDBInstance.state === MongoDB_1.MongoState.Disconnected) {
                yield MongoDB_1.MongoDBInstance.startConnection();
            }
            yield MongoDB_1.MongoDBInstance.clearDb();
        }));
    });
    mocha_1.describe('Signup', () => {
        mocha_1.it('Register a new manager', () => __awaiter(void 0, void 0, void 0, function* () {
            const { token, expiresIn } = yield apiInstance.user_signUp(manager, authDataFields);
            assert_1.default.strictEqual(typeof token, 'string');
            assert_1.default.strictEqual(typeof expiresIn, 'string');
        }));
        mocha_1.it('Try to register a manager with another user\'s username', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield noTokenApiInstance.user_signUp(manager, authDataFields);
            }
            catch (error) {
                assert_1.default.strictEqual(error, ErrorMessages_1.default.user_username_already_exists);
            }
        }));
        mocha_1.it('Try to register a manager with missing required fields', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { name } = manager, rest = __rest(manager
                // @ts-expect-error => name is required
                , ["name"]);
                // @ts-expect-error => name is required
                yield noTokenApiInstance.user_signUp(rest, authDataFields);
            }
            catch (error) {
                assert_1.default.strictEqual(typeof error, 'string');
                assert_1.default.strictEqual(helpers_1.validationErrorRegEx.test(error), true);
            }
        }));
    });
    mocha_1.describe('Login', () => {
        mocha_1.it('Login manager', () => __awaiter(void 0, void 0, void 0, function* () {
            const { token, expiresIn } = yield apiInstance.user_login(managerCredentials, authDataFields);
            assert_1.default.strictEqual(typeof token, 'string');
            assert_1.default.strictEqual(typeof expiresIn, 'string');
            apiInstance.setToken(token);
        }));
        mocha_1.it('Try to login with wrong password', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { username } = managerCredentials;
                yield noTokenApiInstance.user_login({ username, password: 'wrongPassword' }, authDataFields);
            }
            catch (error) {
                assert_1.default.strictEqual(error, ErrorMessages_1.default.user_password_not_correct);
            }
        }));
        mocha_1.it('Try to login with non existing username', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { password } = managerCredentials;
                yield noTokenApiInstance.user_login({ username: 'eminem72', password }, authDataFields);
            }
            catch (error) {
                assert_1.default.strictEqual(error, ErrorMessages_1.default.user_user_not_exists);
            }
        }));
    });
    mocha_1.describe('Get user data', () => {
        mocha_1.it('Get user connected data', () => __awaiter(void 0, void 0, void 0, function* () {
            const { name, surname, dateOfBirth, phone, sex } = yield apiInstance.user_getUserConnected(`{
        name,
        surname,
        dateOfBirth,
        phone,
        sex
      }`);
            assert_1.default.strictEqual(name, manager.name);
            assert_1.default.strictEqual(surname, manager.surname);
            assert_1.default.strictEqual(moment_1.default(dateOfBirth).isSame(manager.dateOfBirth), true);
            assert_1.default.strictEqual(phone, manager.phone);
            assert_1.default.strictEqual(sex, manager.sex);
        }));
        mocha_1.it('Try to get user data without token', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield noTokenApiInstance.user_getUserConnected(`{
        name,
        surname,
        dateOfBirth,
        phone,
        sex
      }`);
            }
            catch (error) {
                assert_1.default.strictEqual(error, ErrorMessages_1.default.user_unauthenticated);
            }
        }));
    });
    mocha_1.describe('Update user data', () => {
        mocha_1.it('Change username ', () => __awaiter(void 0, void 0, void 0, function* () {
            const newUsername = 'alezen7';
            const ok = yield apiInstance.user_changeUsername(newUsername);
            assert_1.default.strictEqual(ok, true);
            managerCredentials.username = newUsername;
        }));
        mocha_1.it('Change password', () => __awaiter(void 0, void 0, void 0, function* () {
            const newPassword = 'alezen7';
            const ok = yield apiInstance.user_changePassword(managerCredentials.password, newPassword);
            assert_1.default.strictEqual(ok, true);
            managerCredentials.password = newPassword;
        }));
        mocha_1.it('Update some user info', () => __awaiter(void 0, void 0, void 0, function* () {
            const newUserData = {
                name: 'Boban',
                surname: 'Cvetanoski'
            };
            const ok = yield apiInstance.user_updateUser(newUserData);
            assert_1.default.strictEqual(ok, true);
            const { name, surname } = yield apiInstance.user_getUserConnected(`{
        name,
        surname
      }`);
            assert_1.default.strictEqual(name, newUserData.name);
            assert_1.default.strictEqual(surname, newUserData.surname);
        }));
        mocha_1.it('Try to change username without token', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield noTokenApiInstance.user_changeUsername('test');
            }
            catch (error) {
                assert_1.default.strictEqual(error, ErrorMessages_1.default.user_unauthenticated);
            }
        }));
        mocha_1.it('Try to change password without token', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield noTokenApiInstance.user_changePassword(managerCredentials.password, 'test');
            }
            catch (error) {
                assert_1.default.strictEqual(error, ErrorMessages_1.default.user_unauthenticated);
            }
        }));
        mocha_1.it('Try to change password with wrong old password', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield apiInstance.user_changePassword('wrongOldPassword', 'test');
            }
            catch (error) {
                assert_1.default.strictEqual(error, ErrorMessages_1.default.user_password_not_correct);
            }
        }));
        mocha_1.it('Try to set new password equal to new password', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield apiInstance.user_changePassword(managerCredentials.password, managerCredentials.password);
            }
            catch (error) {
                assert_1.default.strictEqual(error, ErrorMessages_1.default.user_new_old_password_equal);
            }
        }));
        mocha_1.it('Try to update some user info without token', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const newUserData = {
                    name: 'Boban',
                    surname: 'Cvetanoski'
                };
                yield noTokenApiInstance.user_updateUser(newUserData);
            }
            catch (error) {
                assert_1.default.strictEqual(error, ErrorMessages_1.default.user_unauthenticated);
            }
        }));
    });
});
//# sourceMappingURL=Auth.test.js.map