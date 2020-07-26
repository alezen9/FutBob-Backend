"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collections = [
    {
        name: 'User',
        indexes: [
            { 'credentials.username': 1 }
        ]
    },
    {
        name: 'Player',
        indexes: []
    },
    {
        name: 'Match',
        indexes: []
    }
    //   {
    //     name: 'AggregationPlayer',
    //     indexes: []
    //   },
    //   {
    //     name: 'AggregationMatches',
    //     indexes: []
    //   }
];
exports.default = Collections;
//# sourceMappingURL=Collections.js.map