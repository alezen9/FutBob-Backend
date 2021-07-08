import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { Appointment, AppointmentInvites, AppointmentMatch, AppointmentPlayerType, AppointmentStats, AppointmentTypePlayer } from "../../../MongoDB/Appointment/Entities";
import { playerLoader } from "../../Player/loaders";
import { freeAgentLoader } from "../../FreeAgent/loaders"
import { Field } from "../../../MongoDB/Field/Entities";
import { fieldLoader } from "../../Field/loaders";

@Resolver(of => Appointment)
export class AppointmentFieldResolvers implements ResolverInterface<Appointment> {

   private loadAppointmentPlayer (el: AppointmentTypePlayer) {
      return el.type === AppointmentPlayerType.Registered
         ? playerLoader.load(el.player.toHexString())
         : freeAgentLoader.load(el.player.toHexString())
   }

   @FieldResolver(() => Field)
   // @ts-ignore
   async field(@Root() root: Appointment): Promise<Field> {
      return fieldLoader.load(root.field.toHexString())
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
            declined: playerLoader.loadMany(declined.map(String)),
            ignored: playerLoader.loadMany(ignored.map(String))
         }
      }
   }
   
   @FieldResolver(() => AppointmentStats)
   // @ts-ignore
   async stats(@Root() root: Appointment) {
      return {
         ...root.stats,
         ...root.stats.mvp && {
            mvp: {
               ...root.stats.mvp,
               player: {
                  ...root.stats.mvp.player,
                  player: this.loadAppointmentPlayer(root.stats.mvp.player)
               }
            }
         },
         mvpElegible: root.stats.mvpElegible.map(el => ({
            ...el,
            player: this.loadAppointmentPlayer(el)
         })),
         topScorers: root.stats.topScorers.map(el => ({
            ...el,
            player: this.loadAppointmentPlayer(el)
         })),
         topAssistmen: root.stats.topAssistmen.map(el => ({
            ...el,
            player: this.loadAppointmentPlayer(el)
         })),
         individualStats: root.stats.individualStats.map(el => ({
            ...el,
            player: {
               ...el.player,
               player: this.loadAppointmentPlayer(el.player)
            }
         }))
      }
   }

   @FieldResolver(() => [AppointmentMatch])
   // @ts-ignore
   async matches(@Root() root: Appointment) {
      return (root.matches || []).map(match => ({
         ...match,
         teamA: {
            ...match.teamA,
            players: match.teamA.players.map(el => ({
               ...el,
               player: this.loadAppointmentPlayer(el)
            }))
         },
         teamB: {
            ...match.teamB,
            players: match.teamB.players.map(el => ({
               ...el,
               player: this.loadAppointmentPlayer(el)
            }))
         },
      }))
   }
}