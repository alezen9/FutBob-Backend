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
exports.FutBobServer = void 0;
const axios_1 = __importDefault(require("axios"));
const lodash_1 = require("lodash");
const helpers_1 = require("../Utils/helpers");
require('dotenv').config();
class FutBobServer {
    constructor(_host) {
        this._self = axios_1.default.create({
            baseURL: _host || process.env.NODE_ENV === 'prod' ? process.env.BASE_API_URL : 'http://localhost:7000',
            timeout: 100000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        this._self.interceptors.response.use((response) => response.data || null, (error) => {
            throw lodash_1.get(error, 'response.data.errors[0].message', error);
        });
    }
    setToken(token) {
        const tokenSet = lodash_1.get(this._self, 'defaults.headers.common.Authorization', undefined);
        let _token = tokenSet ? tokenSet.split(' ')[1] : undefined;
        if (token !== _token) {
            this._self.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }
    user_signUp(signupInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    mutation {
        signup(signupInput: ${helpers_1.paramsToString(signupInput)}){
          token,
          expiresIn
        }
    }`;
            return yield this._self.post('/graphql', { query })
                .then((res) => {
                const { data, errors } = res;
                if (errors && errors.length)
                    throw errors[0].message;
                else
                    return data.signup;
            });
        });
    }
}
exports.FutBobServer = FutBobServer;
const apiInstance = new FutBobServer();
exports.default = apiInstance;
//# sourceMappingURL=index.js.map