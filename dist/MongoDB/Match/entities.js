"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MatchPlayer {
}
exports.MatchPlayer = MatchPlayer;
var MatchState;
(function (MatchState) {
    MatchState[MatchState["Scheduled"] = 0] = "Scheduled";
    MatchState[MatchState["Confirmed"] = 1] = "Confirmed";
    MatchState[MatchState["Completed"] = 2] = "Completed";
    MatchState[MatchState["Canceled"] = 3] = "Canceled";
})(MatchState = exports.MatchState || (exports.MatchState = {}));
class Match {
}
exports.Match = Match;
//# sourceMappingURL=Entities.js.map