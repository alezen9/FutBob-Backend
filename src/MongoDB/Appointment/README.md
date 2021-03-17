# Appointments

## Appointment_Create
> Creates appointment.

```Typescript
interface createBody {
   field: string
   autoBlockInvitesQuorum?: number
   timeAndDate: Date|string
   invitedPlayers:? string[]
   confirmedPlayers:? {
      player: string
      type: 0|1 // Registered player or free agent
   }[]
   notes:? string
})



// Thits will create the an entry like the following in the Appointment collection:

const Appointment = {
   _id: '507f1f77bcf86cd799439011',
   createdBy: '507f191e810c19729de860ea',
   createdAt: '2021-03-06T01:55:59.139Z', // 6 Mar 2021
   updatedAt: '2021-03-06T01:55:59.139Z', // 6 Mar 2021
   timeAndDate: '2021-03-10T19:00:00.760Z', // 10 Mar 2021 at 20:00
   state: 0, // Scheduled
   autoBlockInvitesQuorum: 15,
   inviteState: 0, // Open
   field: '507f191e810c19729de860ea', // Bolbeno arena
   invitedPlayers: ['507f191e810c19729de860ea', '507f191e810c19729de860ea', ...]
   ditchedPlayers: []
   confirmedPlayers: []
}
```
At this point the Appointment has beend created and it's scheduled for 4 days from today at 20:00 at Bolbeno Arena.


</br></br></br>

## Appointment_Update
> Updates the appointment info.

```Typescript
interface TypedPlayer {
   type: 0|1 // Registered player or free agent
   player: string
}

interface updateBody {
   field:? string
   timeAndDate:? Date|string
   invitedPlayers:? string[]
   ditchedPlayers:? TypedPlayer[]
   confirmedPlayers:? TypedPlayer[]
   autoBlockInvitesQuorum:? number
   matches:? {
      teamA: {
         players: TypedPlayer[] // subset of confirmed
         name: string
         score: number
      }
      teamB: {
         players: TypedPlayer[] // subset of confirmed
         name: string
         score: number
      }
      winner: 'teamA'|'teamB'
   }[]
   stats: {
      individualStats: {
         player: TypedPlayer
         rating: number
         goals: number
         assists: number
      }[] // to be provided for every confirmed player
   }
   notes:? string
})
```

| Prop      | When can be updated |
| ----------- | ----------- |
| field      | Appointment Scheduled or Confirmed  |
| timeAndDate   | Appointment Scheduled or Confirmed  |
| invitedPlayers   | Appointment Scheduled  |
| ditchedPlayers   | Appointment Scheduled or Confirmed  |
| confirmedPlayers   | Appointment Scheduled or Confirmed  |
| autoBlockInvitesQuorum   | Appointment Scheduled |
| notes   | Appointment Scheduled or Confirmed  |
| matches   | Appointment Confirmed  |
| stats   | Appointment Confirmed  |

</br></br></br>


## Appointment_UpdateState
> Updates the appointment state manually.

| From      | To |
| ----------- | ----------- |
| Scheduled      | Confirmed, Canceled  |
| Confirmed   | Completed, Canceled, Interrupted  |
| Completed   | -  |
| Canceled   | -  |
| Interrupted   | -  |

</br></br></br>


## Appointment_UpdateInviteState
> Updates the inviteState manually. If closed no more invite actions will be considered.

| From      | To | When |
| ----------- | ----------- | ----------- |
| Open      | Closed  | Appointment Scheduled
| Closed   | Open  | Appointment Scheduled

</br></br></br>


## Appointment_UpdateConfirmedPlayers
> Updates confirmedPlayers array being given all the new confirmed players.

| From      | To | When |
| ----------- | ----------- | ----------- |
| Open      | Closed  | Appointment Scheduled
| Closed   | Open  | Appointment Scheduled