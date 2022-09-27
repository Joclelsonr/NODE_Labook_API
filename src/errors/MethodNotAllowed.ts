import { BaseError } from "./BaseError";

export class MethodNotAllowed extends BaseError {
  constructor(message: string = "O usuário so pode ser ADMIN ou NORMAL") {
    super(405, message);
  }
}
