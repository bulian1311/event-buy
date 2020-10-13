import { CustomError } from "./custom.error";

export class NotAuthError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Не авторизованный пользователь.");
    Object.setPrototypeOf(this, NotAuthError.prototype);
  }

  serializeErrors() {
    return [{ message: "Не авторизованный пользователь." }];
  }
}
