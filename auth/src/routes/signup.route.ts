import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { BadRequestError } from "@magmer/common";
import { validateRequest } from "@magmer/common";

import { User } from "../models/user.model";

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
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return next(new BadRequestError("Такой емейл уже используется."));

      const user = User.build({ email, password });
      await user.save();

      const userJwt = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_KEY!
      );

      req.session = { jwt: userJwt };

      res.status(201).send(user);
    } catch (err) {
      return next(err);
    }
  }
);

export { router as signupRouter };
