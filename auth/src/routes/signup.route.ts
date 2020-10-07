import express, { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { BadRequestError } from "../errors/bad-request.error";
import { RequestValidationError } from "../errors/request-validation.error";

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
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new RequestValidationError(errors.array()));
    }

    const { email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return next(new BadRequestError("Такой емейл уже используется."));

      const user = User.build({ email, password });
      await user.save();

      res.status(201).send(user);
    } catch (err) {
      next(err);
    }
  }
);

export { router as signupRouter };
