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
const moment_1 = __importDefault(require("moment"));
const __1 = require("..");
const mongodb_1 = require("mongodb");
const User_1 = require("../User");
const Entities_1 = require("./Entities");
class MongoPlayer {
    createPlayer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = moment_1.default().toDate();
            const player = new Entities_1.Player();
            player._id = new mongodb_1.ObjectId();
            player.user = new mongodb_1.ObjectId(data.idUser);
            player.positions = data.positions;
            player.state = data.state || Entities_1.PhysicalState.Top;
            player.type = data.type;
            player.createdAt = now;
            player.updatedAt = now;
            player.score = this.assignScoreValues(data);
            yield __1.MongoDBInstance.collection.player.insertOne(player);
            yield User_1.mongoUser.assignPlayer(Object.assign(Object.assign({ idUser: data.idUser }, player.type === Entities_1.PlayerType.Football && { footballPlayer: (player._id).toHexString() }), player.type === Entities_1.PlayerType.Futsal && { futsalPlayer: (player._id).toHexString() }));
            return player._id.toHexString();
        });
    }
    getPlayers(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ids, position, type, matchId, state } = filters;
            const query = [];
            if (ids && ids.length)
                query.push({ $match: { _id: { $in: ids.map(mongodb_1.ObjectId) } } });
            if (type !== undefined)
                query.push({ type });
            if (state !== undefined)
                query.push({ state });
            if (position !== undefined)
                query.push({ positions: { $elemMatch: position } });
            if (matchId !== undefined)
                query.push({ matches: { $elemMatch: matchId } });
            const players = query.length
                ? yield __1.MongoDBInstance.collection.player.aggregate(query).toArray()
                : yield __1.MongoDBInstance.collection.player.find({}).toArray();
            return players;
        });
    }
    assignScoreValues(data) {
        const score = new Entities_1.PlayerScore();
        const pace = new Entities_1.Pace();
        pace.acceleration = data.score.pace.acceleration;
        pace.sprintSpeed = data.score.pace.sprintSpeed;
        const shooting = new Entities_1.Shooting();
        shooting.finishing = data.score.shooting.finishing;
        shooting.longShots = data.score.shooting.longShots;
        shooting.penalties = data.score.shooting.penalties;
        shooting.positioning = data.score.shooting.positioning;
        shooting.shotPower = data.score.shooting.shotPower;
        shooting.volleys = data.score.shooting.volleys;
        const passing = new Entities_1.Passing();
        passing.crossing = data.score.passing.crossing;
        passing.curve = data.score.passing.curve;
        passing.freeKick = data.score.passing.freeKick;
        passing.longPassing = data.score.passing.longPassing;
        passing.shortPassing = data.score.passing.shortPassing;
        passing.vision = data.score.passing.vision;
        const dribbling = new Entities_1.Dribbling();
        dribbling.agility = data.score.dribbling.agility;
        dribbling.balance = data.score.dribbling.balance;
        dribbling.ballControl = data.score.dribbling.ballControl;
        dribbling.composure = data.score.dribbling.composure;
        dribbling.dribbling = data.score.dribbling.dribbling;
        dribbling.reactions = data.score.dribbling.reactions;
        const defense = new Entities_1.Defense();
        defense.defensiveAwareness = data.score.defense.defensiveAwareness;
        defense.heading = data.score.defense.heading;
        defense.interceptions = data.score.defense.interceptions;
        defense.slidingTackle = data.score.defense.slidingTackle;
        defense.standingTackle = data.score.defense.standingTackle;
        const physical = new Entities_1.Physical();
        physical.aggression = data.score.physical.aggression;
        physical.jumping = data.score.physical.jumping;
        physical.stamina = data.score.physical.stamina;
        physical.strength = data.score.physical.strength;
        score.pace = pace;
        score.shooting = shooting;
        score.passing = passing;
        score.dribbling = dribbling;
        score.defense = defense;
        score.physical = physical;
        return score;
    }
    getPlayerById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const player = yield __1.MongoDBInstance.collection.player.findOne({ _id: new mongodb_1.ObjectId(_id) });
            return player;
        });
    }
    getTypePlayerFields(player) {
        const { _id, matches = [], user } = player, rest = __rest(player, ["_id", "matches", "user"]);
        return Object.assign(Object.assign({}, rest), { _id: _id.toHexString(), user: user.toHexString(), matches: matches.map((_id) => _id.toHexString()) });
    }
}
exports.mongoPlayer = new MongoPlayer();
//# sourceMappingURL=index.js.map