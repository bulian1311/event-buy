import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation.error";
import { DatabaseConnectionError } from "../errors/db-connection.error";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Неверный емейл."),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Пароль должен быть от 4 до 20 символов"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new RequestValidationError(errors.array()));
    }

    const { email, password } = req.body;

    console.log("creating user...", email, password);

    res.send("");
  }
);

export { router as signupRouter };
