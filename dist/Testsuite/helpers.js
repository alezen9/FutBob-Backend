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
exports.setupTestsuite = exports.TestsuiteSetupStep = exports.validationErrorRegEx = exports.ShouldFail = exports.ShouldSucceed = void 0;
const entities_1 = require("../MongoDB/User/entities");
const Entities_1 = require("../MongoDB/Player/Entities");
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
const manager = Object.assign({ name: 'Aleksandar', surname: 'Gjroeski', dateOfBirth: '1993-07-02T22:00:00.000Z', phone: '+39 1234567890', sex: entities_1.Sex.Male }, managerCredentials);
const authDataFields = `{
  token,
  expiresIn
}`;
const players = [
    {
        _id: undefined,
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
                stamina: 78,
                defence: 63,
                balance: 82,
                ballControl: 93,
                passing: 95,
                finishing: 89
            }
        }
    },
    {
        _id: undefined,
        userData: {
            name: 'Cristian Camilo',
            surname: 'Quintero Villa',
            dateOfBirth: '1994-01-04T23:00:00.000Z',
            phone: '+39 234234342',
            sex: entities_1.Sex.Male
        },
        playerData: {
            positions: [
                Entities_1.PlayerPosition.FutsalForward,
                Entities_1.PlayerPosition.FutsalForward
            ],
            type: Entities_1.PlayerType.Futsal,
            radarData: {
                speed: 85,
                stamina: 83,
                defence: 88,
                balance: 89,
                ballControl: 90,
                passing: 95,
                finishing: 86
            }
        }
    },
    {
        _id: undefined,
        userData: {
            name: 'Boban',
            surname: 'Cvetanoski',
            dateOfBirth: '1997-08-17T22:00:00.000Z',
            phone: '+39 7686787874',
            sex: entities_1.Sex.Male
        },
        playerData: {
            positions: [
                Entities_1.PlayerPosition.FutsalForward,
                Entities_1.PlayerPosition.FutsalForward,
                Entities_1.PlayerPosition.FutsalGoalKeeper
            ],
            type: Entities_1.PlayerType.Futsal,
            radarData: {
                speed: 65,
                stamina: 70,
                defence: 70,
                balance: 75,
                ballControl: 78,
                passing: 83,
                finishing: 77
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