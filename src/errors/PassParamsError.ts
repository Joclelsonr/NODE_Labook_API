import { BaseError } from "./BaseError";

export class PassParamsError extends BaseError {
  constructor(message: string = "Parâmetro 'password' inválido") {
    super(422, message);
  }
}
