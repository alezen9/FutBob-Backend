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
const axios_1 = __importDefault(require("axios"));
const lodash_1 = require("lodash");
const helpers_1 = require("../Utils/helpers");
require('dotenv').config();
class FutBobServer {
    constructor(_host) {
        this._self = axios_1.default.create({
            baseURL: _host || process.env.NODE_ENV === 'production' ? process.env.BASE_API_URL : 'http://localhost:7000',
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
    API({ query, name }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._self.post('/graphql', { query })
                .then((res) => {
                const { data, errors } = res;
                if (errors && errors.length)
                    throw errors[0].message;
                else
                    return data[name];
            });
        });
    }
    setToken(token) {
        const tokenSet = lodash_1.get(this._self, 'defaults.headers.common.Authorization', undefined);
        let _token = tokenSet ? tokenSet.split(' ')[1] : undefined;
        if (token !== _token) {
            this._self.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }
    user_signUp(signupInput, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    mutation {
        signup(signupInput: ${helpers_1.paramsToString(signupInput)})${fields}
    }`;
            return this.API({ query, name: 'signup' });
        });
    }
    user_login(signinInput, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    query {
        login(signinInput: ${helpers_1.paramsToString(signinInput)})${fields}
    }`;
            return this.API({ query, name: 'login' });
        });
    }
    user_getUserConnected(fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    query {
        getUserConnected ${fields}
    }`;
            return this.API({ query, name: 'getUserConnected' });
        });
    }
    user_changeUsername(newUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    mutation {
        changeUsername(newUsername: "${newUsername}")
    }`;
            return this.API({ query, name: 'changeUsername' });
        });
    }
    user_changePassword(oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    mutation {
        changePassword(oldPassword: "${oldPassword}", newPassword: "${newPassword}")
    }`;
            return this.API({ query, name: 'changePassword' });
        });
    }
    user_updateUserConnected(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    mutation {
        updateUserConnected(userInput: ${helpers_1.paramsToString(userInput)})
    }`;
            return this.API({ query, name: 'updateUserConnected' });
        });
    }
    user_updateUser(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    mutation {
        updateUser(userInput: ${helpers_1.paramsToString(userInput)})
    }`;
            return this.API({ query, name: 'updateUser' });
        });
    }
    player_createPlayer(createPlayerInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    mutation {
        createPlayer(createPlayerInput: ${helpers_1.paramsToString(createPlayerInput)})
    }`;
            return this.API({ query, name: 'createPlayer' });
        });
    }
    player_updatePlayer(updatePlayerInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    mutation {
        updatePlayer(updatePlayerInput: ${helpers_1.paramsToString(updatePlayerInput)})
    }`;
            return this.API({ query, name: 'updatePlayer' });
        });
    }
    player_deletePlayer(deletePlayerInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    mutation {
        deletePlayer(deletePlayerInput: ${helpers_1.paramsToString(deletePlayerInput)})
    }`;
            return this.API({ query, name: 'deletePlayer' });
        });
    }
    player_getPlayers(playerFilters, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
    query {
        getPlayers(playerFilters: ${helpers_1.paramsToString(playerFilters)}) ${fields}
    }`;
            return this.API({ query, name: 'getPlayers' });
        });
    }
}
exports.FutBobServer = FutBobServer;
//# sourceMappingURL=index.js.map