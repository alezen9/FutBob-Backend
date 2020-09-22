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
const Entities_1 = require("../MongoDB/User/Entities");
const ErrorMessages_1 = __importDefault(require("../Utils/ErrorMessages"));
const Entities_2 = require("../MongoDB/Player/Entities");
const lodash_1 = require("lodash");
const apiInstance = new SDK_1.FutBobServer();
const noTokenApiInstance = new SDK_1.FutBobServer();
const player1 = {
    _id: undefined,
    idUser: undefined,
    userData: {
        name: 'Naumche',
        surname: 'Gjroeski',
        dateOfBirth: '1985-01-03T23:00:00.000Z',
        phone: '+39 234234342',
        sex: Entities_1.Sex.Male,
        country: 'MK'
    },
    playerData: {
        positions: [
            Entities_2.PlayerPosition.CenterForward,
            Entities_2.PlayerPosition.CentreBack,
            Entities_2.PlayerPosition.DefensiveMidfielder
        ],
        type: Entities_2.PlayerType.Football,
        score: {
            pace: {
                acceleration: 78,
                sprintSpeed: 84
            },
            shooting: {
                positioning: 82,
                finishing: 87,
                shotPower: 91,
                longShots: 86,
                volleys: 75,
                penalties: 85
            },
            passing: {
                vision: 87,
                crossing: 73,
                freeKick: 77,
                shortPassing: 93,
                longPassing: 89,
                curve: 87
            },
            dribbling: {
                agility: 85,
                balance: 83,
                reactions: 84,
                ballControl: 85,
                dribbling: 84,
                composure: 80
            },
            defense: {
                interceptions: 70,
                heading: 55,
                defensiveAwareness: 45,
                standingTackle: 55,
                slidingTackle: 40
            },
            physical: {
                jumping: 70,
                stamina: 78,
                strength: 73,
                aggression: 45
            }
        }
    }
};
const player2 = {
    _id: undefined,
    idUser: undefined,
    userData: {
        name: 'Boban',
        surname: 'Cvetanoski',
        dateOfBirth: '1997-08-17T22:00:00.000Z',
        phone: '+39 7686787874',
        sex: Entities_1.Sex.Male,
        country: 'MK'
    },
    playerData: {
        positions: [
            Entities_2.PlayerPosition.FutsalLeftWing,
            Entities_2.PlayerPosition.FutsalRightWing,
            Entities_2.PlayerPosition.FutsalBack,
            Entities_2.PlayerPosition.FutsalGoalKeeper
        ],
        type: Entities_2.PlayerType.Futsal,
        score: {
            pace: {
                acceleration: 35,
                sprintSpeed: 40
            },
            shooting: {
                positioning: 65,
                finishing: 65,
                shotPower: 60,
                longShots: 50,
                volleys: 68,
                penalties: 78
            },
            passing: {
                vision: 73,
                crossing: 68,
                freeKick: 60,
                shortPassing: 80,
                longPassing: 64,
                curve: 58
            },
            dribbling: {
                agility: 45,
                balance: 45,
                reactions: 67,
                ballControl: 60,
                dribbling: 55,
                composure: 68
            },
            defense: {
                interceptions: 68,
                heading: 50,
                defensiveAwareness: 65,
                standingTackle: 68,
                slidingTackle: 61
            },
            physical: {
                jumping: 50,
                stamina: 45,
                strength: 55,
                aggression: 78
            }
        }
    }
};
const _players = [
    {
        userData: {
            name: 'Boban',
            surname: 'Cvetanoski',
            dateOfBirth: '1997-08-17T22:00:00.000Z',
            phone: '+39 7686787874',
            sex: Entities_1.Sex.Male,
            country: 'MK'
        },
        playerData: {
            positions: [
                Entities_2.PlayerPosition.FutsalLeftWing,
                Entities_2.PlayerPosition.FutsalRightWing,
                Entities_2.PlayerPosition.FutsalBack,
                Entities_2.PlayerPosition.FutsalGoalKeeper
            ],
            type: Entities_2.PlayerType.Futsal,
            score: {
                pace: {
                    acceleration: 35,
                    sprintSpeed: 40
                },
                shooting: {
                    positioning: 65,
                    finishing: 65,
                    shotPower: 60,
                    longShots: 50,
                    volleys: 68,
                    penalties: 78
                },
                passing: {
                    vision: 73,
                    crossing: 68,
                    freeKick: 60,
                    shortPassing: 80,
                    longPassing: 64,
                    curve: 58
                },
                dribbling: {
                    agility: 45,
                    balance: 45,
                    reactions: 67,
                    ballControl: 60,
                    dribbling: 55,
                    composure: 68
                },
                defense: {
                    interceptions: 68,
                    heading: 50,
                    defensiveAwareness: 65,
                    standingTackle: 68,
                    slidingTackle: 61
                },
                physical: {
                    jumping: 50,
                    stamina: 45,
                    strength: 55,
                    aggression: 78
                }
            }
        }
    },
    {
        userData: {
            name: 'Aleksandar',
            surname: 'Gjoreski',
            dateOfBirth: '1993-03-06T23:00:00.000Z',
            phone: '+39 3408947641',
            sex: Entities_1.Sex.Male,
            country: 'MK'
        },
        playerData: {
            positions: [
                Entities_2.PlayerPosition.FutsalLeftWing,
                Entities_2.PlayerPosition.FutsalRightWing,
                Entities_2.PlayerPosition.FutsalBack,
                Entities_2.PlayerPosition.FutsalGoalKeeper
            ],
            type: Entities_2.PlayerType.Futsal,
            score: {
                pace: {
                    acceleration: 78,
                    sprintSpeed: 84
                },
                shooting: {
                    positioning: 82,
                    finishing: 87,
                    shotPower: 91,
                    longShots: 86,
                    volleys: 75,
                    penalties: 85
                },
                passing: {
                    vision: 87,
                    crossing: 73,
                    freeKick: 77,
                    shortPassing: 93,
                    longPassing: 89,
                    curve: 87
                },
                dribbling: {
                    agility: 85,
                    balance: 83,
                    reactions: 84,
                    ballControl: 85,
                    dribbling: 84,
                    composure: 80
                },
                defense: {
                    interceptions: 70,
                    heading: 55,
                    defensiveAwareness: 45,
                    standingTackle: 55,
                    slidingTackle: 40
                },
                physical: {
                    jumping: 70,
                    stamina: 78,
                    strength: 73,
                    aggression: 45
                }
            }
        }
    }
];
mocha_1.describe('Player', () => {
    mocha_1.describe('Clear database', () => {
        mocha_1.it('Should clear database', () => __awaiter(void 0, void 0, void 0, function* () {
            if (MongoDB_1.MongoDBInstance.state === MongoDB_1.MongoState.Disconnected) {
                yield MongoDB_1.MongoDBInstance.startConnection();
            }
            yield MongoDB_1.MongoDBInstance.clearDb();
        }));
    });
    mocha_1.describe('Setup', () => {
        mocha_1.it('Register a new manager', () => __awaiter(void 0, void 0, void 0, function* () {
            yield helpers_1.setupTestsuite(helpers_1.TestsuiteSetupStep.WithManager, apiInstance);
        }));
    });
    mocha_1.describe('Create', () => {
        mocha_1.it('Create a new player', () => __awaiter(void 0, void 0, void 0, function* () {
            const { _id, idUser } = player1, body = __rest(player1, ["_id", "idUser"]);
            const playerId = yield apiInstance.player_createPlayer(body);
            player1._id = playerId;
            const players = yield apiInstance.player_getPlayers({}, `{ _id, user { _id }, type }`);
            assert_1.default.strictEqual(players.length, 1);
            assert_1.default.strictEqual(players[0]._id, playerId);
            assert_1.default.strictEqual(players[0].type, player1.playerData.type);
            player1.idUser = players[0].user._id;
        }));
        mocha_1.it('Try to create a new player without token', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { _id, idUser } = player1, body = __rest(player1, ["_id", "idUser"]);
                yield noTokenApiInstance.player_createPlayer(body);
            }
            catch (error) {
                assert_1.default.strictEqual(error, ErrorMessages_1.default.user_unauthenticated);
            }
        }));
        mocha_1.it('Try to create a new player without specified user', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { _id, idUser, userData } = player1, body = __rest(player1
                // @ts-expect-error => userData is required
                , ["_id", "idUser", "userData"]);
                // @ts-expect-error => userData is required
                yield apiInstance.player_createPlayer(body);
            }
            catch (error) {
                assert_1.default.strictEqual(error, ErrorMessages_1.default.player_user_not_specified);
            }
        }));
        mocha_1.it('Try to create a new player with missing required fields', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { _id, idUser, playerData } = player1, body = __rest(player1
                // @ts-expect-error => playerData is required
                , ["_id", "idUser", "playerData"]);
                // @ts-expect-error => playerData is required
                yield apiInstance.player_createPlayer(body);
            }
            catch (error) {
                assert_1.default.strictEqual(typeof error, 'string');
                assert_1.default.strictEqual(helpers_1.validationErrorRegEx.test(error), true);
            }
        }));
    });
    mocha_1.describe('Delete', () => {
        mocha_1.it('Try to delete an existing player without token', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { _id, idUser, playerData: { type } } = player1;
                const done = yield noTokenApiInstance.player_deletePlayer({
                    _id,
                    idUser,
                    type
                });
            }
            catch (error) {
                assert_1.default.strictEqual(error, ErrorMessages_1.default.user_unauthenticated);
            }
        }));
        mocha_1.it('Delete an existing player', () => __awaiter(void 0, void 0, void 0, function* () {
            const { _id, idUser, playerData: { type } } = player1;
            const done = yield apiInstance.player_deletePlayer({
                _id,
                idUser,
                type
            });
            assert_1.default.strictEqual(done, true);
            const players = yield apiInstance.player_getPlayers({}, `{ _id }`);
            assert_1.default.strictEqual(players.length, 0);
            player1._id = undefined;
            player1.idUser = undefined;
        }));
    });
    mocha_1.describe('Update', () => {
        mocha_1.it('Create 2 new player', () => __awaiter(void 0, void 0, void 0, function* () {
            const { _id, idUser } = player1, body = __rest(player1, ["_id", "idUser"]);
            const playerId = yield apiInstance.player_createPlayer(body);
            const { _id: _id2, idUser: idUser2 } = player2, body2 = __rest(player2, ["_id", "idUser"]);
            const playerId2 = yield apiInstance.player_createPlayer(body2);
            const players = yield apiInstance.player_getPlayers({}, `{ _id, user { _id }, type }`);
            assert_1.default.strictEqual(players.length, 2);
            assert_1.default.strictEqual(players[0]._id, playerId);
            assert_1.default.strictEqual(players[0].type, player1.playerData.type);
            assert_1.default.strictEqual(players[1]._id, playerId2);
            assert_1.default.strictEqual(players[1].type, player2.playerData.type);
            player1._id = playerId;
            player2._id = playerId2;
            player1.idUser = players[0].user._id;
            player2.idUser = players[1].user._id;
        }));
        mocha_1.it('Update a player position', () => __awaiter(void 0, void 0, void 0, function* () {
            const { _id } = player1;
            const done = yield apiInstance.player_updatePlayer({
                _id,
                positions: [Entities_2.PlayerPosition.Striker]
            });
            const players = yield apiInstance.player_getPlayers({ ids: [_id] }, `{ _id, positions }`);
            assert_1.default.strictEqual(players.length, 1);
            assert_1.default.strictEqual(lodash_1.isEqual(players[0].positions, [Entities_2.PlayerPosition.Striker]), true);
        }));
        mocha_1.it('Update a player score values', () => __awaiter(void 0, void 0, void 0, function* () {
            const { _id, playerData: { score } } = player1;
            const newScoreValues = Object.assign(Object.assign({}, score), { pace: {
                    acceleration: 100,
                    sprintSpeed: 100
                } });
            const done = yield apiInstance.player_updatePlayer({
                _id,
                score: newScoreValues
            });
            const players = yield apiInstance.player_getPlayers({ ids: [_id] }, `{ _id, score { pace { acceleration, sprintSpeed } } }`);
            assert_1.default.strictEqual(players.length, 1);
            assert_1.default.strictEqual(players[0].score.pace.acceleration, newScoreValues.pace.acceleration);
            assert_1.default.strictEqual(players[0].score.pace.sprintSpeed, newScoreValues.pace.sprintSpeed);
        }));
        mocha_1.it('Update a player info', () => __awaiter(void 0, void 0, void 0, function* () {
            const { _id, idUser } = player1;
            const newName = 'Ace';
            yield apiInstance.user_updateUser({
                _id: idUser,
                name: newName
            });
            const players = yield apiInstance.player_getPlayers({ ids: [_id] }, `{ _id, user { _id, name } }`);
            assert_1.default.strictEqual(players.length, 1);
            assert_1.default.strictEqual(players[0].user._id, idUser);
            assert_1.default.strictEqual(players[0].user.name, newName);
        }));
        mocha_1.it('Try to update a deleted player position', () => __awaiter(void 0, void 0, void 0, function* () {
            const { _id, idUser, playerData: { type } } = player1;
            yield apiInstance.player_deletePlayer({
                _id,
                idUser,
                type
            });
            const players = yield apiInstance.player_getPlayers({ ids: [_id] }, `{ _id }`);
            assert_1.default.strictEqual(players.length, 0);
            try {
                yield apiInstance.player_updatePlayer({
                    _id,
                    positions: [Entities_2.PlayerPosition.LeftWingBack]
                });
            }
            catch (error) {
                assert_1.default.strictEqual(error, ErrorMessages_1.default.player_update_not_possible);
            }
        }));
        // only for testing
        mocha_1.it('Populate players', () => __awaiter(void 0, void 0, void 0, function* () {
            let lotOfPlayers = _players;
            // for(let i = 0; i < 100; i++) {
            //   lotOfPlayers = [...lotOfPlayers, ..._players]
            // }
            const promises = lotOfPlayers.map(body => apiInstance.player_createPlayer(body));
            yield Promise.all(promises);
        }));
    });
});
//# sourceMappingURL=Player.test.js.map