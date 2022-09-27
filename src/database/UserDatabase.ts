import BaseDatabase from "./BaseDatabase";
import { IUserDB, User } from "../models/User";
import { MethodNotAllowed } from "../errors/MethodNotAllowed";

export class UserDatabase extends BaseDatabase {
  public static TABLE_USERS = "Labook_Users";

  public saveUser = async (user: User) => {
    const userDB: IUserDB = {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      role: user.getRole(),
    };

    await this.getConnection().insert(userDB).into(UserDatabase.TABLE_USERS);
  };

  public checkEmail = async (email: string) => {
    const result = await this.getConnection()
      .select("*")
      .from(UserDatabase.TABLE_USERS)
      .where({ email });
    return result[0];
  };

  public modifyRole = async (userId: string, role: string) => {
    try {
      await this.getConnection()
        .update("role", `${role}`)
        .from(UserDatabase.TABLE_USERS)
        .where({ id: userId.toUpperCase() });

      return "Usuario alterado com sucesso!";
    } catch (error: any) {
      if (error.sqlMessage.includes("Data truncated")) {
        throw new MethodNotAllowed();
      }
    }
  };
}
