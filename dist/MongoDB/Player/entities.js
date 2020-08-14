"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerPosition;
(function (PlayerPosition) {
    PlayerPosition[PlayerPosition["FutsalGoalKeeper"] = 0] = "FutsalGoalKeeper";
    PlayerPosition[PlayerPosition["FutsalBack"] = 1] = "FutsalBack";
    PlayerPosition[PlayerPosition["FutsalLeftWing"] = 2] = "FutsalLeftWing";
    PlayerPosition[PlayerPosition["FutsalRightWing"] = 3] = "FutsalRightWing";
    PlayerPosition[PlayerPosition["FutsalForward"] = 4] = "FutsalForward";
    PlayerPosition[PlayerPosition["Goalkeeper"] = 5] = "Goalkeeper";
    PlayerPosition[PlayerPosition["Sweeper"] = 6] = "Sweeper";
    PlayerPosition[PlayerPosition["CentreBack"] = 7] = "CentreBack";
    PlayerPosition[PlayerPosition["LeftFullBack"] = 8] = "LeftFullBack";
    PlayerPosition[PlayerPosition["RightFullBack"] = 9] = "RightFullBack";
    PlayerPosition[PlayerPosition["LeftWingBack"] = 10] = "LeftWingBack";
    PlayerPosition[PlayerPosition["RightWingBack"] = 11] = "RightWingBack";
    PlayerPosition[PlayerPosition["DefensiveMidfielder"] = 12] = "DefensiveMidfielder";
    PlayerPosition[PlayerPosition["CentralMidfielder"] = 13] = "CentralMidfielder";
    PlayerPosition[PlayerPosition["LeftMidfielder"] = 14] = "LeftMidfielder";
    PlayerPosition[PlayerPosition["RightMidfielder"] = 15] = "RightMidfielder";
    PlayerPosition[PlayerPosition["AttackingMidfielder"] = 16] = "AttackingMidfielder";
    PlayerPosition[PlayerPosition["CenterForward"] = 17] = "CenterForward";
    PlayerPosition[PlayerPosition["Striker"] = 18] = "Striker";
    PlayerPosition[PlayerPosition["SecondStriker"] = 19] = "SecondStriker";
})(PlayerPosition = exports.PlayerPosition || (exports.PlayerPosition = {}));
class RadarData {
}
exports.RadarData = RadarData;
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