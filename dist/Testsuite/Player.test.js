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
const Entities_1 = require("../MongoDB/Player/Entities");
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
        sex: entities_1.Sex.Male
    },
    playerData: {
        positions: [
            Entities_1.PlayerPosition.CenterForward,
            Entities_1.PlayerPosition.CentreBack,
            Entities_1.PlayerPosition.DefensiveMidfielder
        ],
        type: Entities_1.PlayerType.Football,
        radarData: {
            speed: 75,
            stamina: 80,
            defence: 65,
            balance: 80,
            ballControl: 90,
            passing: 95,
            finishing: 80
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
        sex: entities_1.Sex.Male
    },
    playerData: {
        positions: [
            Entities_1.PlayerPosition.FutsalLeftWing,
            Entities_1.PlayerPosition.FutsalRightWing,
            Entities_1.PlayerPosition.FutsalBack,
            Entities_1.PlayerPosition.FutsalGoalKeeper
        ],
        type: Entities_1.PlayerType.Futsal,
        radarData: {
            speed: 65,
            stamina: 70,
            defence: 70,
            balance: 70,
            ballControl: 65,
            passing: 75,
            finishing: 70
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
            sex: entities_1.Sex.Male
        },
        playerData: {
            positions: [
                Entities_1.PlayerPosition.FutsalLeftWing,
                Entities_1.PlayerPosition.FutsalRightWing,
                Entities_1.PlayerPosition.FutsalBack,
                Entities_1.PlayerPosition.FutsalGoalKeeper
            ],
            type: Entities_1.PlayerType.Futsal,
            radarData: {
                speed: 95,
                stamina: 90,
                defence: 90,
                balance: 90,
                ballControl: 95,
                passing: 95,
                finishing: 99
            }
        }
    },
    {
        userData: {
            name: 'Aleksandar',
            surname: 'Gjoreski',
            dateOfBirth: '1993-03-06T23:00:00.000Z',
            phone: '+39 3408947641',
            sex: entities_1.Sex.Male
        },
        playerData: {
            positions: [
                Entities_1.PlayerPosition.FutsalLeftWing,
                Entities_1.PlayerPosition.FutsalRightWing,
                Entities_1.PlayerPosition.FutsalBack,
                Entities_1.PlayerPosition.FutsalGoalKeeper
            ],
            type: Entities_1.PlayerType.Futsal,
            radarData: {
                speed: 11,
                stamina: 10,
                defence: 10,
                balance: 10,
                ballControl: 15,
                passing: 15,
                finishing: 10
            }
        }
    },
    {
        userData: {
            name: 'Emilio',
            surname: 'Cvetanoski',
            dateOfBirth: '2000-10-03T22:00:00.000Z',
            phone: '+39 3895010053',
            sex: entities_1.Sex.Male
        },
        playerData: {
            positions: [
                Entities_1.PlayerPosition.FutsalLeftWing,
                Entities_1.PlayerPosition.FutsalRightWing,
                Entities_1.PlayerPosition.FutsalBack,
                Entities_1.PlayerPosition.FutsalGoalKeeper
            ],
            type: Entities_1.PlayerType.Futsal,
            radarData: {
                speed: 45,
                stamina: 77,
                defence: 70,
                balance: 70,
                ballControl: 65,
                passing: 75,
                finishing: 70
            }
        }
    },
    {
        userData: {
            name: 'Cvete',
            surname: 'Pavloski',
            dateOfBirth: '1996-05-04T22:00:00.000Z',
            phone: '+39 3348023216',
            sex: entities_1.Sex.Male
        },
        playerData: {
            positions: [
                Entities_1.PlayerPosition.FutsalLeftWing,
                Entities_1.PlayerPosition.FutsalRightWing,
                Entities_1.PlayerPosition.FutsalBack,
                Entities_1.PlayerPosition.FutsalGoalKeeper
            ],
            type: Entities_1.PlayerType.Futsal,
            radarData: {
                speed: 65,
                stamina: 70,
                defence: 90,
                balance: 50,
                ballControl: 45,
                passing: 45,
                finishing: 70
            }
        }
    },
    {
        userData: {
            name: 'Luka',
            surname: 'Buisic',
            dateOfBirth: '1996-08-26T22:00:00.000Z',
            phone: '+39 3452285280',
            sex: entities_1.Sex.Male
        },
        playerData: {
            positions: [
                Entities_1.PlayerPosition.FutsalLeftWing,
                Entities_1.PlayerPosition.FutsalRightWing,
                Entities_1.PlayerPosition.FutsalBack,
                Entities_1.PlayerPosition.FutsalGoalKeeper
            ],
            type: Entities_1.PlayerType.Futsal,
            radarData: {
                speed: 74,
                stamina: 40,
                defence: 60,
                balance: 50,
                ballControl: 45,
                passing: 45,
                finishing: 70
            }
        }
    },
    {
        userData: {
            name: 'Silvio',
            surname: 'Pedretti',
            dateOfBirth: '1997-06-12T22:00:00.000Z',
            phone: '+39 3466131159',
            sex: entities_1.Sex.Male
        },
        playerData: {
            positions: [
                Entities_1.PlayerPosition.FutsalLeftWing,
                Entities_1.PlayerPosition.FutsalRightWing,
                Entities_1.PlayerPosition.FutsalBack,
                Entities_1.PlayerPosition.FutsalGoalKeeper
            ],
            type: Entities_1.PlayerType.Futsal,
            radarData: {
                speed: 74,
                stamina: 40,
                defence: 60,
                balance: 50,
                ballControl: 45,
                passing: 45,
                finishing: 70
            }
        }
    },
    {
        userData: {
            name: 'Cristian',
            surname: 'Quintero',
            dateOfBirth: '1994-01-05T23:00:00.000Z',
            phone: '+39 3272423160',
            sex: entities_1.Sex.Male
        },
        playerData: {
            positions: [
                Entities_1.PlayerPosition.FutsalLeftWing,
                Entities_1.PlayerPosition.FutsalRightWing,
                Entities_1.PlayerPosition.FutsalBack,
                Entities_1.PlayerPosition.FutsalGoalKeeper
            ],
            type: Entities_1.PlayerType.Futsal,
            radarData: {
                speed: 94,
                stamina: 90,
                defence: 10,
                balance: 10,
                ballControl: 15,
                passing: 15,
                finishing: 70
            }
        }
    },
    {
        userData: {
            name: 'Dimitar',
            surname: 'Tankoski',
            dateOfBirth: '1996-11-08T23:00:00.000Z',
            phone: '+39 3791916071',
            sex: entities_1.Sex.Male
        },
        playerData: {
            positions: [
                Entities_1.PlayerPosition.FutsalLeftWing,
                Entities_1.PlayerPosition.FutsalRightWing,
                Entities_1.PlayerPosition.FutsalBack,
                Entities_1.PlayerPosition.FutsalGoalKeeper
            ],
            type: Entities_1.PlayerType.Futsal,
            radarData: {
                speed: 94,
                stamina: 90,
                defence: 10,
                balance: 10,
                ballControl: 15,
                passing: 15,
                finishing: 70
            }
        }
    },
    {
        userData: {
            name: 'Martino',
            surname: 'Bomprezzi',
            dateOfBirth: '1996-12-31T23:00:00.000Z',
            phone: '+39 3319538690',
            sex: entities_1.Sex.Male
        },
        playerData: {
            positions: [
                Entities_1.PlayerPosition.FutsalLeftWing,
                Entities_1.PlayerPosition.FutsalRightWing,
                Entities_1.PlayerPosition.FutsalBack,
                Entities_1.PlayerPosition.FutsalGoalKeeper
            ],
            type: Entities_1.PlayerType.Futsal,
            radarData: {
                speed: 94,
                stamina: 90,
                defence: 10,
                balance: 10,
                ballControl: 15,
                passing: 15,
                finishing: 70
            }
        }
    },
    {
        userData: {
            name: 'Vasko',
            surname: 'Rizmanoski',
            dateOfBirth: '1969-12-31T23:00:00.000Z',
            phone: '+39 3396468704',
            sex: entities_1.Sex.Male
        },
        playerData: {
            positions: [
                Entities_1.PlayerPosition.FutsalLeftWing,
                Entities_1.PlayerPosition.FutsalRightWing,
                Entities_1.PlayerPosition.FutsalBack,
                Entities_1.PlayerPosition.FutsalGoalKeeper
            ],
            type: Entities_1.PlayerType.Futsal,
            radarData: {
                speed: 94,
                stamina: 90,
                defence: 10,
                balance: 10,
                ballControl: 15,
                passing: 15,
                finishing: 70
            }
        }
    },
    {
        userData: {
            name: 'Vasko',
            surname: 'Cvetanoski',
            dateOfBirth: '1997-01-15T23:00:00.000Z',
            phone: '+39 3398617608',
            sex: entities_1.Sex.Male
        },
        playerData: {
            positions: [
                Entities_1.PlayerPosition.FutsalLeftWing,
                Entities_1.PlayerPosition.FutsalRightWing,
                Entities_1.PlayerPosition.FutsalBack,
                Entities_1.PlayerPosition.FutsalGoalKeeper
            ],
            type: Entities_1.PlayerType.Futsal,
            radarData: {
                speed: 94,
                stamina: 90,
                defence: 10,
                balance: 10,
                ballControl: 15,
                passing: 15,
                finishing: 70
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
                positions: [Entities_1.PlayerPosition.Striker]
            });
            const players = yield apiInstance.player_getPlayers({ ids: [_id] }, `{ _id, positions }`);
            assert_1.default.strictEqual(players.length, 1);
            assert_1.default.strictEqual(lodash_1.isEqual(players[0].positions, [Entities_1.PlayerPosition.Striker]), true);
        }));
        mocha_1.it('Update a player radar values', () => __awaiter(void 0, void 0, void 0, function* () {
            const { _id } = player1;
            const newRadarData = {
                speed: 90,
                stamina: 88,
                defence: 55,
                balance: 80,
                ballControl: 99,
                passing: 100,
                finishing: 97
            };
            const done = yield apiInstance.player_updatePlayer({
                _id,
                radarData: newRadarData
            });
            const players = yield apiInstance.player_getPlayers({ ids: [_id] }, `{ _id, radar { speed, stamina, defence, balance, ballControl, passing, finishing } }`);
            assert_1.default.strictEqual(players.length, 1);
            assert_1.default.strictEqual(lodash_1.isEqual(players[0].radar, newRadarData), true);
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
                    positions: [Entities_1.PlayerPosition.LeftWingBack]
                });
            }
            catch (error) {
                assert_1.default.strictEqual(error, ErrorMessages_1.default.player_update_not_possible);
            }
        }));
        // only for testing
        mocha_1.it('Populate players', () => __awaiter(void 0, void 0, void 0, function* () {
            const promises = _players.map(body => apiInstance.player_createPlayer(body));
            yield Promise.all(promises);
        }));
    });
});
//# sourceMappingURL=Player.test.js.map