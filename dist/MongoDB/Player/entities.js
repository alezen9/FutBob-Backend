"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerPosition;
(function (PlayerPosition) {
    PlayerPosition[PlayerPosition["Goalkeeper"] = 0] = "Goalkeeper";
    PlayerPosition[PlayerPosition["Sweeper"] = 1] = "Sweeper";
    PlayerPosition[PlayerPosition["CentreBack"] = 2] = "CentreBack";
    PlayerPosition[PlayerPosition["LeftFullBack"] = 3] = "LeftFullBack";
    PlayerPosition[PlayerPosition["RightFullBack"] = 4] = "RightFullBack";
    PlayerPosition[PlayerPosition["LeftWingBack"] = 5] = "LeftWingBack";
    PlayerPosition[PlayerPosition["RightWingBack"] = 6] = "RightWingBack";
    PlayerPosition[PlayerPosition["DefensiveMidfielder"] = 7] = "DefensiveMidfielder";
    PlayerPosition[PlayerPosition["CentralMidfielder"] = 8] = "CentralMidfielder";
    PlayerPosition[PlayerPosition["LeftMidfielder"] = 9] = "LeftMidfielder";
    PlayerPosition[PlayerPosition["RightMidfielder"] = 10] = "RightMidfielder";
    PlayerPosition[PlayerPosition["AttackingMidfielder"] = 11] = "AttackingMidfielder";
    PlayerPosition[PlayerPosition["CenterForward"] = 12] = "CenterForward";
    PlayerPosition[PlayerPosition["Striker"] = 13] = "Striker";
    PlayerPosition[PlayerPosition["SecondStriker"] = 14] = "SecondStriker";
    PlayerPosition[PlayerPosition["FutsalGoalKeeper"] = 15] = "FutsalGoalKeeper";
    PlayerPosition[PlayerPosition["FutsalBack"] = 16] = "FutsalBack";
    PlayerPosition[PlayerPosition["FutsalForward"] = 17] = "FutsalForward";
})(PlayerPosition = exports.PlayerPosition || (exports.PlayerPosition = {}));
var PlayerType;
(function (PlayerType) {
    PlayerType[PlayerType["Football"] = 0] = "Football";
    PlayerType[PlayerType["Futsal"] = 1] = "Futsal";
})(PlayerType = exports.PlayerType || (exports.PlayerType = {}));
var PhysicalState;
(function (PhysicalState) {
    PhysicalState[PhysicalState["Top"] = 0] = "Top";
    PhysicalState[PhysicalState["Medium"] = 1] = "Medium";
    PhysicalState[PhysicalState["Low"] = 2] = "Low";
    PhysicalState[PhysicalState["Injured"] = 3] = "Injured";
    PhysicalState[PhysicalState["Recovery"] = 4] = "Recovery";
})(PhysicalState = exports.PhysicalState || (exports.PhysicalState = {}));
class Player {
}
exports.Player = Player;
//# sourceMappingURL=Entities.js.map