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
Object.defineProperty(exports, "__esModule", { value: true });
const Entities_1 = require("../MongoDB/User/Entities");
const Entities_2 = require("../MongoDB/Player/Entities");
const ResetColor = '\x1b[0m';
const FgGreen = '\x1b[32m';
const FgRed = '\x1b[31m';
exports.ShouldSucceed = `${FgGreen}Should succeed ⇩${ResetColor}`;
exports.ShouldFail = `${FgRed}Should fail ⇩${ResetColor}`;
exports.validationErrorRegEx = /^Field.*required.*was\snot\sprovided\.$/;
// type SetupParams = {
//     createRandomUsers: boolean
// }
const managerCredentials = {
    username: 'alezen9',
    password: 'alezen9'
};
const manager = Object.assign({ name: 'Aleksandar', surname: 'Gjroeski', dateOfBirth: '1993-07-02T22:00:00.000Z', phone: '+39 1234567890', sex: Entities_1.Sex.Male, country: 'MK' }, managerCredentials);
const authDataFields = `{
  token,
  expiresIn
}`;
const players = [
    {
        _id: undefined,
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
        _id: undefined,
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
var TestsuiteSetupStep;
(function (TestsuiteSetupStep) {
    TestsuiteSetupStep[TestsuiteSetupStep["WithManager"] = 0] = "WithManager";
    TestsuiteSetupStep[TestsuiteSetupStep["WithPlayers"] = 1] = "WithPlayers";
})(TestsuiteSetupStep = exports.TestsuiteSetupStep || (exports.TestsuiteSetupStep = {}));
exports.setupTestsuite = (step, apiInstance) => __awaiter(void 0, void 0, void 0, function* () {
    // register manager
    const { token } = yield apiInstance.user_signUp(manager, authDataFields);
    apiInstance.setToken(token);
    if (step === TestsuiteSetupStep.WithManager) {
        return {
            token,
            manager
        };
    }
    // create some players
    const createPlayerPromises = players.map((_a, i) => {
        var { _id } = _a, body = __rest(_a, ["_id"]);
        return apiInstance.player_createPlayer(body)
            .then(_id => {
            players[i]._id = _id;
        });
    });
    yield Promise.all(createPlayerPromises);
    if (step === TestsuiteSetupStep.WithPlayers) {
        return {
            token,
            manager,
            players
        };
    }
});
//# sourceMappingURL=helpers.js.map