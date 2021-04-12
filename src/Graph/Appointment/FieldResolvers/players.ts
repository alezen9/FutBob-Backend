import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { Player } from "../../../MongoDB/Player/Entities";
import { Appointment, AppointmentPlayerType, AppointmentTypePlayerUnion } from "../../../MongoDB/Appointment/Entities";
import { playerLoader } from "../../Player/loaders";
import { freeAgentLoader } from "../../FreeAgent/loaders"
import { FreeAgent } from "../../../MongoDB/FreeAgent/Entities"


@Resolver(of => Appointment)
export class PlayerFieldResolver implements ResolverInterface<Appointment> {

   @FieldResolver(() => [Player])
   async invitedPlayers(@Root() root: Appointment): Promise<(Player|Error)[]> {
      return playerLoader.loadMany(root.invites.lists.invited.map(({ player }) => String(player)))
   }

   @FieldResolver(() => [Player])
   async declinedPlayers(@Root() root: Appointment): Promise<(Player|Error)[]> {
      return playerLoader.loadMany(root.invites.lists.declined.map(String))
   }

   @FieldResolver(() => [AppointmentTypePlayerUnion])
   async waitingPlayers(@Root() root: Appointment): Promise<(Player|FreeAgent|Error)[]> {
      return [...(root.invites.lists.waiting || []).reduce((acc, typedPlayer) => {
         const _id = String(typedPlayer.player)
         if(typedPlayer.type === AppointmentPlayerType.Registered) acc.push(playerLoader.load(_id))
         if(typedPlayer.type === AppointmentPlayerType.FreeAgent) acc.push(freeAgentLoader.load(_id))
         return acc
      }, [])]
   }

   @FieldResolver(() => [AppointmentTypePlayerUnion])
   async waitingPlayers(@Root() root: Appointment): Promise<(Player|FreeAgent|Error)[]> {
      return [...(root.invites.lists.waiting || []).reduce((acc, typedPlayer) => {
         const _id = String(typedPlayer.player)
         if(typedPlayer.type === AppointmentPlayerType.Registered) acc.push(playerLoader.load(_id))
         if(typedPlayer.type === AppointmentPlayerType.FreeAgent) acc.push(freeAgentLoader.load(_id))
         return acc
      }, [])]
   }
   
}