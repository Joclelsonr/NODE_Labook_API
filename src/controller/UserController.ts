import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { inputLoginDTO, inputRoleDTO, inputSignupDTO } from "../models/User";

export class UserController {
  constructor(private userBusiness: UserBusiness) {}

  public signup = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      const input: inputSignupDTO = { name, email, password };

      const response = await this.userBusiness.signup(input);

      res.status(201).send(response);
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .send({ message: error.message || error.sqlMessage });
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const input: inputLoginDTO = { email, password };

      const response = await this.userBusiness.login(input);

      res.status(200).send(response);
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .send({ message: error.message || error.sqlMessage });
    }
  };

  public auth = async (req: Request, res: Response) => {
    try {
      const { userId, role } = req.body;
      const token = req.headers.authorization as string;

      const input: inputRoleDTO = { token, userId, role };

      const response = await this.userBusiness.auth(input);

      res.status(200).send({ message: response });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .send({ message: error.message || error.sqlMessage });
    }
  };
}
