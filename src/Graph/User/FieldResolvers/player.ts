import { FieldResolver, Resolver, ResolverInterface, Root } from "type-graphql";
import { Player } from "../../../MongoDB/Player/Entities";
import { User } from "../../../MongoDB/User/Entities";
import { playerLoader } from "../../Player/loader";

@Resolver(of => User)
export class PlayerFieldResolver implements ResolverInterface<User> {

   @FieldResolver(() => Player)
   // @ts-ignore
   async player(@Root() root: User): Promise<Player|null> {
      return root.player
         ? playerLoader.load(root.player)
         : null
   }
   
}