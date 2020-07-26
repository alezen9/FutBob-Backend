"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.PhysicalState = exports.PlayerType = exports.Positions = void 0;
var Positions;
(function (Positions) {
    Positions[Positions["Goalkeeper"] = 0] = "Goalkeeper";
    Positions[Positions["Sweeper"] = 1] = "Sweeper";
    Positions[Positions["CentreBack"] = 2] = "CentreBack";
    Positions[Positions["LeftFullBack"] = 3] = "LeftFullBack";
    Positions[Positions["RightFullBack"] = 4] = "RightFullBack";
    Positions[Positions["LeftWingBack"] = 5] = "LeftWingBack";
    Positions[Positions["RightWingBack"] = 6] = "RightWingBack";
    Positions[Positions["DefensiveMidfielder"] = 7] = "DefensiveMidfielder";
    Positions[Positions["CentralMidfielder"] = 8] = "CentralMidfielder";
    Positions[Positions["LeftMidfielder"] = 9] = "LeftMidfielder";
    Positions[Positions["RightMidfielder"] = 10] = "RightMidfielder";
    Positions[Positions["AttackingMidfielder"] = 11] = "AttackingMidfielder";
    Positions[Positions["CenterForward"] = 12] = "CenterForward";
    Positions[Positions["Striker"] = 13] = "Striker";
    Positions[Positions["SecondStriker"] = 14] = "SecondStriker";
    Positions[Positions["FutsalGoalKeeper"] = 15] = "FutsalGoalKeeper";
    Positions[Positions["FutsalBack"] = 16] = "FutsalBack";
    Positions[Positions["FutsalForward"] = 17] = "FutsalForward";
})(Positions = exports.Positions || (exports.Positions = {}));
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