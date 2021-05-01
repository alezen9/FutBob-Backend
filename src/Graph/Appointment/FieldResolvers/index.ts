import { FieldResolver, ObjectType, Resolver, ResolverInterface, Root, Field, ID, Int, createUnionType } from "type-graphql";
import { Player } from "../../../MongoDB/Player/Entities";
import { Appointment, AppointmentInvitesState, AppointmentPlayerType, InviteResponse } from "../../../MongoDB/Appointment/Entities";
import { playerLoader } from "../../Player/loaders";
import { freeAgentLoader } from "../../FreeAgent/loaders"
import { FreeAgent } from "../../../MongoDB/FreeAgent/Entities"
import { IsEnum } from "class-validator"

export const AppointmentTypePlayerUnion = createUnionType({
  name: "AppointmentTypePlayerUnion", // the name of the GraphQL union
  types: () => [Player, FreeAgent] as const, // function that returns tuple of object types classes
})

@ObjectType()
class AppointmentInvitesListsRegisteredPlayerEnhanced {
   @Field(() => ID)
   _id: String
   @Field(() => Player)
   player: Player
}

@ObjectType()
class AppointmentInvitesListsTypedPlayerEnhanced {
   @Field(() => ID)
   _id: String
   @Field(() => Int)
   @IsEnum(AppointmentPlayerType)
   type: AppointmentPlayerType
   @Field(() => AppointmentTypePlayerUnion)
   player: (Player|FreeAgent)[]
}

@ObjectType()
class AppointmentInvitesListsInvitedEnhanced {
   @Field(() => ID)
   _id: String
   @Field(() => Player)
   player: Player
   @Field(() => String, { nullable: true })
   firstOpen?: Date|string
   @Field(() => [InviteResponse])
   responses: InviteResponse[]
}

@ObjectType()
class AppointmentInviteListsEnhanced {
   @Field(() => [AppointmentInvitesListsInvitedEnhanced])
    invited: AppointmentInvitesListsInvitedEnhanced[]
    @Field(() => [AppointmentInvitesListsRegisteredPlayerEnhanced])
    declined: AppointmentInvitesListsRegisteredPlayerEnhanced[]
    @Field(() => [AppointmentInvitesListsTypedPlayerEnhanced])
    waiting: AppointmentInvitesListsTypedPlayerEnhanced[]
    @Field(() => [AppointmentInvitesListsTypedPlayerEnhanced])
    confirmed: AppointmentInvitesListsTypedPlayerEnhanced[]
    @Field(() => [AppointmentInvitesListsTypedPlayerEnhanced])
    blacklisted: AppointmentInvitesListsTypedPlayerEnhanced[]
    @Field(() => [AppointmentInvitesListsRegisteredPlayerEnhanced])
    ignored: AppointmentInvitesListsRegisteredPlayerEnhanced[]
}

@ObjectType()
class AppointmentInvitesEnhanced {
   @Field(() => Int)
   @IsEnum(AppointmentInvitesState)
   state: AppointmentInvitesState
   @Field(() => Int)
   minQuorum: number
   @Field(() => Int)
   maxQuorum: number
   @Field(() => Int)
   checkpointQuorum: number
   @Field(() => AppointmentInviteListsEnhanced)
   lists: AppointmentInviteListsEnhanced
}



@Resolver(of => Appointment)
export class AppointmentFieldResolvers implements ResolverInterface<Appointment> {

   @FieldResolver(() => AppointmentInvitesEnhanced)
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
               _id: el._id.toHexString(),
               player: playerLoader.load(el._id.toHexString())
            })),
            confirmed: confirmed.map(el => ({
               ...el,
               _id: el._id.toHexString(),
               player: el.type === AppointmentPlayerType.Registered
                  ? playerLoader.load(el._id.toHexString())
                  : freeAgentLoader.load(el._id.toHexString())
            })),
            waiting: waiting.map(el => ({
               ...el,
               _id: el._id.toHexString(),
               player: el.type === AppointmentPlayerType.Registered
                  ? playerLoader.load(el._id.toHexString())
                  : freeAgentLoader.load(el._id.toHexString())
            })),
            blacklisted: blacklisted.map(el => ({
               ...el,
               _id: el._id.toHexString(),
               player: el.type === AppointmentPlayerType.Registered
                  ? playerLoader.load(el._id.toHexString())
                  : freeAgentLoader.load(el._id.toHexString())
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

   // @FieldResolver(() => [AppointmentInvitesListsInvitedEnhanced])
   // async "invites.lists.invited"(@Root() root: Appointment) {
   //    return root.invites.lists.invited.map(el => ({
   //       ...el,
   //       _id: el._id.toHexString(),
   //       player: playerLoader.load(el._id.toHexString())
   //    }))
   // }

   // @FieldResolver(() => [AppointmentInvitesListsTypedPlayerEnhanced])
   // async "invites.lists.confirmed"(@Root() root: Appointment) {
   //    return root.invites.lists.confirmed.map(el => ({
   //       ...el,
   //       _id: el._id.toHexString(),
   //       player: el.type === AppointmentPlayerType.Registered
   //          ? playerLoader.load(el._id.toHexString())
   //          : freeAgentLoader.load(el._id.toHexString())
   //    }))
   // }

   // @FieldResolver(() => [AppointmentInvitesListsTypedPlayerEnhanced])
   // async "invites.lists.waiting"(@Root() root: Appointment) {
   //    return root.invites.lists.waiting.map(el => ({
   //       ...el,
   //       _id: el._id.toHexString(),
   //       player: el.type === AppointmentPlayerType.Registered
   //          ? playerLoader.load(el._id.toHexString())
   //          : freeAgentLoader.load(el._id.toHexString())
   //    }))
   // }

   // @FieldResolver(() => [AppointmentInvitesListsTypedPlayerEnhanced])
   // async "invites.lists.blacklisted"(@Root() root: Appointment) {
   //    return root.invites.lists.blacklisted.map(el => ({
   //       ...el,
   //       _id: el._id.toHexString(),
   //       player: el.type === AppointmentPlayerType.Registered
   //          ? playerLoader.load(el._id.toHexString())
   //          : freeAgentLoader.load(el._id.toHexString())
   //    }))
   // }

   // @FieldResolver(() => [AppointmentInvitesListsRegisteredPlayerEnhanced])
   // async "invites.lists.declined"(@Root() root: Appointment) {
   //    return root.invites.lists.declined.map(_id => ({
   //       _id: _id.toHexString(),
   //       player: playerLoader.load(_id.toHexString())
   //    }))
   // }

   // @FieldResolver(() => [AppointmentInvitesListsRegisteredPlayerEnhanced])
   // async "invites.lists.ignored"(@Root() root: Appointment) {
   //    return root.invites.lists.ignored.map(_id => ({
   //       _id: _id.toHexString(),
   //       player: playerLoader.load(_id.toHexString())
   //    }))
   // }
   
}