import { UserDatabase } from "../database/UserDatabase";
import { EmailParamsError } from "../errors/EmailParamsError";
import { ParamsError } from "../errors/ParamsError";
import { PassParamsError } from "../errors/PassParamsError";
import { Authenticator, ITokenPayload } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import {
  inputLoginDTO,
  inputRoleDTO,
  inputSignupDTO,
  IUserDB,
  User,
  USER_ROLES,
} from "../models/User";
import { AuthenticationError } from "../errors/AuthenticationError";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private hashManager: HashManager,
    private authenticator: Authenticator
  ) {}

  public signup = async (input: inputSignupDTO) => {
    const { name, email, password } = input;

    if (!name || !email || !password) {
      throw new ParamsError();
    }

    if (typeof name !== "string" || name.length < 3) {
      throw new Error("Parâmetro 'name' inválido");
    }

    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      throw new EmailParamsError();
    }

    if (typeof password !== "string" || password.length < 6) {
      throw new PassParamsError();
    }

    const userBD = await this.userDatabase.checkEmail(email);

    if (userBD) {
      throw new Error("E-mail já cadastrado");
    }

    const id = this.idGenerator.generate();
    const hashedPassword = await this.hashManager.hash(password);

    const newUser = new User(
      id,
      name,
      email,
      hashedPassword,
      USER_ROLES.NORMAL
    );

    await this.userDatabase.saveUser(newUser);

    const payload: ITokenPayload = {
      id: newUser.getId(),
      role: newUser.getRole(),
    };

    const token = this.authenticator.generateToken(payload);

    const response = {
      message: "Cadastro realizado com sucesso",
      token,
    };

    return response;
  };

  public login = async (input: inputLoginDTO) => {
    const { email, password } = input;

    if (!email || !password) {
      throw new ParamsError();
    }

    if (typeof email !== "string" || email.length < 3) {
      throw new EmailParamsError();
    }

    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
    ) {
      throw new EmailParamsError();
    }

    if (typeof password !== "string" || password.length < 6) {
      throw new PassParamsError();
    }

    const userDB: IUserDB = await this.userDatabase.checkEmail(email);
    if (!userDB) {
      throw new Error("E-mail não cadastrado");
    }

    const checkPassword = await this.hashManager.compare(
      password,
      userDB.password
    );
    if (!checkPassword) {
      throw new Error("Senha incorreta");
    }

    const payload: ITokenPayload = {
      id: userDB.id,
      role: userDB.role,
    };

    const token = this.authenticator.generateToken(payload);

    const response = {
      message: "Login realizado com sucesso",
      token,
    };

    return response;
  };

  public auth = async (input: inputRoleDTO) => {
    const { token, userId, role } = input;

    if (!token || !userId || !role) {
      throw new ParamsError();
    }

    const verifyToken = this.authenticator.getTokenPayload(token) as any;
    if (verifyToken.role !== USER_ROLES.ADMIN) {
      throw new AuthenticationError();
    }

    const result = this.userDatabase.modifyRole(userId, role);

    return result;
  };
}
