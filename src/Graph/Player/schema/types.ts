import { TypeListOf } from '../../genericTypes'

export default `
    type PlayerScorePace {
        speed: Int!,
        stamina: Int!
    }

    type PlayerScoreShooting {
        finishing: Int!,
        shotPower: Int!,
        longShots: Int!
    }

    type PlayerScorePassing {
        vision: Int!,
        shortPassing: Int!,
        longPassing: Int!,
    }

    type PlayerScoreTechnique {
        agility: Int!,
        ballControl: Int!,
        dribbling: Int!,
    }

    type PlayerScoreDefense {
        interception: Int!,
        defensiveAwareness: Int!,
        versus: Int!
    }

    type PlayerScorePhysical {
        strength: Int!
    }

    type PlayerScore {
        pace: PlayerScorePace!,
        shooting: PlayerScoreShooting!,
        passing: PlayerScorePassing!,
        technique: PlayerScoreTechnique!,
        defense: PlayerScoreDefense!,
        physical: PlayerScorePhysical!
    }

    type Player {
        _id: String!
        positions: [Int]!,
        type: Int!,
        state: Int,
        user: User!,
        score: PlayerScore!
    }

    ${TypeListOf('Player')}
`
