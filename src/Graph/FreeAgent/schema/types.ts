import { TypeListOf } from '../../genericTypes'

export default `
    type PlayerScorePace {
        acceleration: Int!,
        sprintSpeed: Int!
    }

    type PlayerScoreShooting {
        positioning: Int!,
        finishing: Int!,
        shotPower: Int!,
        longShots: Int!,
        volleys: Int!,
        penalties: Int!
    }

    type PlayerScorePassing {
        vision: Int!,
        crossing: Int!,
        freeKick: Int!,
        shortPassing: Int!,
        longPassing: Int!,
        curve: Int!
    }

    type PlayerScoreDribbling {
        agility: Int!,
        balance: Int!,
        reactions: Int!,
        ballControl: Int!,
        dribbling: Int!,s
        composure: Int!
    }

    type PlayerScoreDefense {
        interceptions: Int!,
        heading: Int!,
        defensiveAwareness: Int!,
        standingTackle: Int!,
        slidingTackle: Int!
    }

    type PlayerScorePhysical {
        jumping: Int!,
        stamina: Int!,
        strength: Int!,
        aggression: Int!
    }

    type PlayerScore {
        pace: PlayerScorePace!,
        shooting: PlayerScoreShooting!,
        passing: PlayerScorePassing!,
        dribbling: PlayerScoreDribbling!,
        defense: PlayerScoreDefense!,
        physical: PlayerScorePhysical!
    }

    type Player {
        _id: String!
        positions: [Int]!,
        type: Int!,
        matches: [Match],
        state: Int,
        user: User!,
        score: PlayerScore!
    }

    ${TypeListOf('Player')}
`
