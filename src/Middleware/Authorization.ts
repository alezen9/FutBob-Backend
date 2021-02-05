import { AuthChecker } from "type-graphql";
import { MyContext } from "../../index";
import { Privilege } from "../MongoDB/Entities";
import ErrorMessages from "../Utils/ErrorMessages";

export const authChecker: AuthChecker<MyContext, Privilege> = ({ context }, roles) => {
   const { req } = context
   if(!req.isAuth) throw new Error(ErrorMessages.user_unauthenticated)
   if(!(req.privileges || []).some(privilege => roles.includes(privilege))) return false
  return true; // or false if access is denied
}