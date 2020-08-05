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
const Player_1 = require("../../MongoDB/Player");
const Entities_1 = require("../../MongoDB/Entities");
const ErrorMessages_1 = __importDefault(require("../../Utils/ErrorMessages"));
const MongoDB_1 = require("../../MongoDB");
const mongodb_1 = require("mongodb");
const lodash_1 = require("lodash");
const clean_deep_1 = __importDefault(require("clean-deep"));
const User_1 = require("../../MongoDB/User");
const isAuth_1 = require("../../Middleware/isAuth");
const Entities_2 = require("../../MongoDB/Player/Entities");
const moment_1 = __importDefault(require("moment"));
const transform_1 = require("./transform");
const playerResolver = {
    Query: {
        getPlayers: (_, { playerFilters }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!req.isAuth)
                throw new Error(ErrorMessages_1.default.user_unauthenticated);
            const players = yield Player_1.mongoPlayer.getPlayers(playerFilters);
            return players.map(transform_1.gql_Player);
        })
    },
    Mutation: {
        createPlayer: (_, { createPlayerInput }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (!req.isAuth)
                    throw new Error(ErrorMessages_1.default.user_unauthenticated);
                isAuth_1.checkPrivileges(req);
                const { userId, userData, playerData } = createPlayerInput;
                if (!userId && (!userData || lodash_1.isEmpty(userData)))
                    throw new Error(ErrorMessages_1.default.player_user_not_specified);
                let idUser = userId;
                if (!idUser) {
                    idUser = yield User_1.mongoUser.createUser(Object.assign(Object.assign({}, userData), { privilege: Entities_1.Privilege.User }));
                }
                const idPlayer = yield Player_1.mongoPlayer.createPlayer(Object.assign(Object.assign({}, playerData), { idUser }));
                return idPlayer;
            }
            catch (error) {
                throw error;
            }
        }),
        updatePlayer: (_, { updatePlayerInput }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!req.isAuth)
                throw new Error(ErrorMessages_1.default.user_unauthenticated);
            const { _id, positions, state } = updatePlayerInput;
            if (lodash_1.isEmpty(clean_deep_1.default(updatePlayerInput)))
                return true;
            const updatedPlayer = new Entities_2.Player();
            if (positions && positions instanceof Array)
                updatedPlayer.positions = positions;
            if (state !== undefined)
                updatedPlayer.state = state;
            updatedPlayer.updatedAt = moment_1.default().toDate();
            const { modifiedCount } = yield MongoDB_1.MongoDBInstance.collection.player.updateOne({ _id: new mongodb_1.ObjectId(_id) }, { $set: updatedPlayer });
            if (modifiedCount === 0)
                throw new Error(ErrorMessages_1.default.player_update_not_possible);
            transform_1.playerLoader.clear(_id);
            return true;
        }),
        deletePlayer: (_, { deletePlayerInput }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            if (!req.isAuth)
                throw new Error(ErrorMessages_1.default.user_unauthenticated);
            const { _id, idUser, type } = deletePlayerInput;
            const promises = [];
            // delete player from player collection
            promises.push(MongoDB_1.MongoDBInstance.collection.player.deleteOne({ _id: new mongodb_1.ObjectId(_id), user: new mongodb_1.ObjectId(idUser) }));
            // delete player from user collection
            promises.push(MongoDB_1.MongoDBInstance.collection.user.updateOne({ _id: new mongodb_1.ObjectId(idUser) }, { $set: Object.assign({}, type === Entities_2.PlayerType.Football
                    ? { footballPlayer: null }
                    : { futsalPlayer: null }) }));
            yield Promise.all(promises);
            transform_1.playerLoader.clear(_id);
            return true;
        })
    }
};
exports.default = playerResolver;
//# sourceMappingURL=player.js.map