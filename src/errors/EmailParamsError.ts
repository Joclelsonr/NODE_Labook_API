import { BaseError } from "./BaseError";

export class EmailParamsError extends BaseError {
  constructor(message: string = "Parâmetro 'email' inválido") {
    super(422, message);
  }
}
