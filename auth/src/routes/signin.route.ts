import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model";
import { PasswordHelper } from "../helpers/password.helper";
import { validateRequest } from "@magmer/common";
import { BadRequestError } from "@magmer/common";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Не корректный емейл."),
    body("password").trim().notEmpty().withMessage("Не корректный пароль."),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return next(new BadRequestError("Неверный емейл или пароль."));
      }

      const matchPassword = await PasswordHelper.compare(
        user.password,
        password
      );
      if (!matchPassword) {
        return next(new BadRequestError("Неверный емейл или пароль."));
      }

      const userJwt = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_KEY!
      );

      req.session = { jwt: userJwt };

      res.status(200).send(user);
    } catch (err) {
      return next(new BadRequestError("Что-то пошло не так."));
    }
  }
);

export { router as signinRouter };
