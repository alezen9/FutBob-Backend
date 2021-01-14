import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { User } from "../../../MongoDB/User/Entities";
import { Player } from "../../../MongoDB/Player/Entities";
import { userLoader } from "../../User/Loader";

@Resolver(of => Player)
export class UserFieldResolver implements ResolverInterface<Player> {

   @FieldResolver(() => User)
   async user(@Root() root: Player): Promise<User> {
      return userLoader.load(root.user)
   }
   
}