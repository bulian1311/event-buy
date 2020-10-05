import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Неверный емейл."),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Палиль должен быть от 4 до 20 символов"),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }

    const { email, password } = req.body;

    console.log("creating user...", email, password);

    res.send("");
  }
);

export { router as signupRouter };
