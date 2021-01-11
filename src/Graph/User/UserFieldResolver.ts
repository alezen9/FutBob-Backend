import { Arg, FieldResolver, Mutation, Query, Resolver, ResolverInterface, Root } from "type-graphql";
import { mongoUser } from "../../MongoDB/User";
import { AuthData, User } from "../../MongoDB/User/Entities";
import ErrorMessages from "../../Utils/ErrorMessages";
import { LoginInput, RegisterInput } from "./inputs";
import bcrypt from 'bcrypt'
import { Privilege } from "../../MongoDB/Entities";
import { Player } from "../../MongoDB/Player/Entities";
import { userLoader } from "./Loader";

@Resolver(of => Player)
export class UserFieldResolver implements ResolverInterface<Player> {

   @FieldResolver(() => User)
   async user(@Root() root: Player): Promise<User> {
      return userLoader.load(root.user)
   }
   
}