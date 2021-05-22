import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { Appointment, AppointmentInvites, AppointmentPlayerType, AppointmentTypePlayer } from "../../../MongoDB/Appointment/Entities";
import { playerLoader } from "../../Player/loaders";
import { freeAgentLoader } from "../../FreeAgent/loaders"

@Resolver(of => Appointment)
export class AppointmentFieldResolvers implements ResolverInterface<Appointment> {

   private loadAppointmentPlayer (el: AppointmentTypePlayer) {
      return el.type === AppointmentPlayerType.Registered
         ? playerLoader.load(el.player.toHexString())
         : freeAgentLoader.load(el.player.toHexString())
   }

   @FieldResolver(() => AppointmentInvites)
   // @ts-ignore
   async invites(@Root() root: Appointment) {
      const {
         invited = [],
         confirmed = [],
         waiting = [],
         declined = [],
         ignored = [],
         blacklisted = []
      } = root.invites.lists
      return {
         ...root.invites,
         lists: {
            invited: invited.map(el => ({
               ...el,
               player: playerLoader.load(el.player.toHexString())
            })),
            confirmed: confirmed.map(el => ({
               ...el,
               player: this.loadAppointmentPlayer(el)
            })),
            waiting: waiting.map(el => ({
               ...el,
               player: this.loadAppointmentPlayer(el)
            })),
            blacklisted: blacklisted.map(el => ({
               ...el,
               player: this.loadAppointmentPlayer(el)
            })),
            declined: declined.map(_id => ({
               _id: _id.toHexString(),
               player: playerLoader.load(_id.toHexString())
            })),
            ignored: ignored.map(_id => ({
               _id: _id.toHexString(),
               player: playerLoader.load(_id.toHexString())
            }))
         }
      }
   }   
}