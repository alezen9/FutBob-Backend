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
require('dotenv').config();
const apiInstance = new SDK_1.FutBobServer();
const apiInstance2 = new SDK_1.FutBobServer();
const manager = {
    name: 'Aleksandar',
    surname: 'Gjroeski',
    dateOfBirth: '1993-07-02T22:00:00.000Z',
    phone: '+39 1234567890',
    sex: entities_1.Sex.Male,
    username: 'alezen9',
    password: 'alezen9'
};
mocha_1.describe('Authentication', () => {
    mocha_1.describe('Clear database', () => {
        mocha_1.it('Should clear database', () => __awaiter(void 0, void 0, void 0, function* () {
            yield MongoDB_1.MongoDBInstance.clearDb();
        }));
    });
    mocha_1.describe('Signup', () => {
        mocha_1.describe(helpers_1.ShouldSucceed, () => {
            mocha_1.it('Registro un nuovo manager', () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const { token, expiresIn } = yield apiInstance.user_signUp(manager);
                    assert_1.default.strictEqual(typeof token, 'string');
                    assert_1.default.strictEqual(typeof expiresIn, 'string');
                    apiInstance.setToken(token);
                }
                catch (error) {
                    console.log(error);
                }
            }));
        });
        mocha_1.describe(helpers_1.ShouldFail, () => {
            mocha_1.it('Tento di registrare un manager con uno username già occupato', () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield apiInstance2.user_signUp(manager);
                }
                catch (error) {
                    assert_1.default.strictEqual(error, ErrorMessages_1.default.username_already_exists);
                }
            }));
            mocha_1.it('Tento di eseguire una registrazione con campi mancanti', () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const { name } = manager, rest = __rest(manager, ["name"]);
                    yield apiInstance2.user_signUp(rest);
                }
                catch (error) {
                    assert_1.default.strictEqual(typeof error, 'string');
                    assert_1.default.strictEqual(helpers_1.validationErrorRegEx.test(error), true);
                }
            }));
        });
    });
    // TODO
    // describe('Login', () => {
    //   describe(ShouldSucceed, () => {
    //     it('Login manager', async () => {
    //       try {
    //         const { token, expiresIn } = await apiInstance.user_signUp(manager)
    //         assert.strictEqual(typeof token, 'string')
    //         assert.strictEqual(typeof expiresIn, 'string')
    //         apiInstance.setToken(token)
    //       } catch (error) {
    //         console.log(error)
    //       }
    //     })
    //   })
    //   describe(ShouldFail, () => {
    //     it('Tento di registrare un manager con uno username già occupato', async () => {
    //       try {
    //         await apiInstance2.user_signUp(manager)
    //       } catch (error) {
    //         assert.strictEqual(error, ErrorMessages.username_already_exists)
    //       }
    //     })
    //     it('Tento di eseguire una registrazione con campi mancanti', async () => {
    //       try {
    //         const { name, ...rest } = manager
    //         await apiInstance2.user_signUp(rest)
    //       } catch (error) {
    //         assert.strictEqual(typeof error, 'string')
    //         assert.strictEqual(validationErrorRegEx.test(error), true)
    //       }
    //     })
    //   })
    // })
});
//# sourceMappingURL=Auth.test.js.map