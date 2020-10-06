import { CustomError } from "./custom.error";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = "Ошибка подключения к базе данных.";

  constructor() {
    super("Ошибка подключения к базе данных.");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
