import { Arg, FieldResolver, Mutation, Query, Resolver, ResolverInterface, Root } from "type-graphql";
import { mongoUser } from "../../MongoDB/User";
import { AuthData, User } from "../../MongoDB/User/Entities";
import ErrorMessages from "../../Utils/ErrorMessages";
import { LoginInput, RegisterInput } from "./inputs";
import bcrypt from 'bcrypt'
import { Privilege } from "../../MongoDB/Entities";
import { userLoader } from "../../Graph-Old/User/resolver/transform";
import { Player } from "../../MongoDB/Player/Entities";
import { playerLoader } from "./Loader";

@Resolver(of => User)
export class PlayerFieldResolver implements ResolverInterface<User> {

   @FieldResolver(() => Player)
   async player(@Root() root: User): Promise<Player|null> {
      return root.player
         ? playerLoader.load(root.player)
         : null
   }
   
}