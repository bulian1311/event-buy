import express, { Request, Response, NextFunction } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthError,
} from "@magmer/common";
import { body } from "express-validator";
import { Product } from "../models/product.model";
import { isNamedExportBindings } from "typescript";

const router = express.Router();

router.put(
  "/api/products/:id",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Заголовок не должен быть пустым."),
    body("price")
      .notEmpty()
      .isInt({ gt: 0 })
      .withMessage("Цена должна быть больше 0."),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, price } = req.body;
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) return next(new NotFoundError());

    if (product.userId !== req.currentUser!.id) return next(new NotAuthError());

    product.set({ title, price });
    await product.save();

    res.send(product);
  }
);

export { router as updateProductRouter };
