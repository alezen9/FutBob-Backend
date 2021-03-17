import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { Player } from "../../../MongoDB/Player/Entities";
import { Appointment, PlayerType, TypePlayerUnion } from "../../../MongoDB/Appointment/Entities";
import { playerLoader } from "../../Player/Loader";
import { freeAgentLoader } from "../../FreeAgent/Loader"
import { FreeAgent } from "../../../MongoDB/FreeAgent/Entities"


@Resolver(of => Appointment)
export class PlayerFieldResolver implements ResolverInterface<Appointment> {

   @FieldResolver(() => [Player])
   // @ts-ignore
   async invitedPlayers(@Root() root: Appointment): Promise<(Player|Error)[]> {
      return playerLoader.loadMany(root.invitedPlayers)
   }

   @FieldResolver(() => [TypePlayerUnion])
   // @ts-ignore
   async ditchedPlayers(@Root() root: Appointment): Promise<(Player|FreeAgent|Error)[]> {
      return [...(root.ditchedPlayers || []).reduce((acc, typedPlayer) => {
         if(typedPlayer.type === PlayerType.Registered) acc.push(playerLoader.load(typedPlayer.player))
         if(typedPlayer.type === PlayerType.FreeAgent) acc.push(freeAgentLoader.load(typedPlayer.player))
         return acc
      }, [])]
   }

   @FieldResolver(() => [TypePlayerUnion])
   // @ts-ignore
   async confirmedPlayers(@Root() root: Appointment): Promise<(Player|FreeAgent|Error)[]> {
      return [...(root.confirmedPlayers || []).reduce((acc, typedPlayer) => {
         if(typedPlayer.type === PlayerType.Registered) acc.push(playerLoader.load(typedPlayer.player))
         if(typedPlayer.type === PlayerType.FreeAgent) acc.push(freeAgentLoader.load(typedPlayer.player))
         return acc
      }, [])]
   }
   
}