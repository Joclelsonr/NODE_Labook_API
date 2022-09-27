import { UserBusiness } from "./business/UserBusiness";
import { UserController } from "./controller/UserController";
import { UserDatabase } from "./database/UserDatabase";
import { Authenticator } from "./services/Authenticator";
import { HashManager } from "./services/HashManager";
import { IdGenerator } from "./services/IdGenerator";

const userController = new UserController(
  new UserBusiness(
    new UserDatabase(),
    new IdGenerator(),
    new HashManager(),
    new Authenticator()
  )
);

export default userController;
