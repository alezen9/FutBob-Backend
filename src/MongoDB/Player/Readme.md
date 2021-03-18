# Player
## Description
> The __Player__ entity is a secondary entity that must be linked to a user in order to exist.

&nbsp;
&nbsp;
&nbsp;
&nbsp;
## Entity
```typescript
class Player {
    _id: ObjectId
    createdBy: ObjectId
    createdAt: Date|string
    updatedAt: Date|string
    positions: PlayerPosition[] // (GoalKeeper|Back|LeftWing|RightWing|Forward)[]
    state?: PhysicalState // Top|Medium|Low|Injured|Recovery
    score: {
        pace: {
            speed: number
            stamina: number
        }
        shooting: {
            finishing: number
            shotPower: number
            longShots: number
        }
        passing: {
            vision: number
            shortPassing: number
            longPassing: number
        }
        technique: {
            agility: number
            ballControl: number
            dribbling: number
        }
        defense: {
            interception: number
            defensiveAwareness: number
            versus: number
        }
        physical: {
            strength: number
        }
    }
    user?: ObjectId // => User
}
```

&nbsp;
&nbsp;
&nbsp;
&nbsp;
## Actions that can be performed directly on the player

&nbsp;
&nbsp;
### Create
>Flow to create a player:
*note: everything is done within one form with steps
1. Manager fills registry information of the player
2. Manager fills player's skills information
3. PLayer is being registered as follows
=> user gets created (api returns an ___id__)  
=> player gets created using the ___id__ that the createUser api returned
```typescript
class CreateUserInput {
    name: string // max length 50 chars
    surname: string // max length 50 chars
    dateOfBirth: string|Date // between 5-70 years
    sex: Sex // Sex.Male|Sex.Female
    country: string // max length 4 chars (eg: IT, UK, FR,...)
    phone: string
    email?: string // max length 50 chars and must be a valid email
}

const userID => await apiInstance.user.create(body: CreateUserInput)

class CreatePlayerInput {
    user: string // the userID returned in the create user api
    positions: PlayerPosition[] // (GoalKeeper|Back|LeftWing|RightWing|Forward)[]
    state?: PhysicalState // Top|Medium|Low|Injured|Recovery
    score: {
        pace: {
            speed: number
            stamina: number
        }
        shooting: {
            finishing: number
            shotPower: number
            longShots: number
        }
        passing: {
            vision: number
            shortPassing: number
            longPassing: number
        }
        technique: {
            agility: number
            ballControl: number
            dribbling: number
        }
        defense: {
            interception: number
            defensiveAwareness: number
            versus: number
        }
        physical: {
            strength: number
        }
    }
}

const playerID => await apiInstance.player.create(body: CreatePlayerInput)
```

&nbsp;
&nbsp;
&nbsp;
&nbsp;
### Update
&nbsp;
| PROPERTY | When can be changed |
| -------- | ------------------- |
| positions | Everytime |
| state | Everytime |
| score | Everytime |

&nbsp;
&nbsp;
&nbsp;
&nbsp;
### Delete
A manager can delete his users (players) at anytime including the player entity that is linked to his user.
