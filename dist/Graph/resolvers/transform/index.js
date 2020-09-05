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
exports.gql_Player = exports.gql_User = exports.playerLoader = exports.userLoader = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const User_1 = require("../../../MongoDB/User");
const Player_1 = require("../../../MongoDB/Player");
exports.userLoader = new dataloader_1.default(userIds => {
    const promises = userIds.map(getUserById);
    return Promise.all(promises);
});
exports.playerLoader = new dataloader_1.default(playerIds => {
    const promises = playerIds.map(getPlayerById);
    return Promise.all(promises);
});
const getUserById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield User_1.mongoUser.getUser({ _id }).then(res => exports.gql_User(res));
    }
    catch (err) {
        throw err;
    }
});
const getPlayerById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Player_1.mongoPlayer.getPlayerById(_id).then(res => exports.gql_Player(res));
    }
    catch (err) {
        throw err;
    }
});
exports.gql_User = (user) => {
    const _a = User_1.mongoUser.getTypeUserFields(user), { futsalPlayer, footballPlayer } = _a, rest = __rest(_a, ["futsalPlayer", "footballPlayer"]);
    return Object.assign(Object.assign({}, rest), { futsalPlayer: futsalPlayer
            ? () => exports.playerLoader.load(futsalPlayer)
            : null, footballPlayer: footballPlayer
            ? () => exports.playerLoader.load(footballPlayer)
            : null });
};
exports.gql_Player = (player) => {
    const _a = Player_1.mongoPlayer.getTypePlayerFields(player), { user } = _a, rest = __rest(_a, ["user"]);
    return Object.assign(Object.assign({}, rest), { user: () => exports.userLoader.load(user) });
};
//# sourceMappingURL=index.js.map