import express, { Request, Response, NextFunction } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthError,
  BadRequestError,
} from "@magmer/common";
import { body } from "express-validator";

import { Product } from "../models/product.model";
import { ProductUpdatePublisher } from "../events/publishers/product-update.publisher";
import { natsWrapper } from "../nats-wrapper";

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

    if (product.orderId) {
      return next(new BadRequestError("Продукт уже в резерве."));
    }

    if (product.userId !== req.currentUser!.id) return next(new NotAuthError());

    product.set({ title, price });
    await product.save();

    new ProductUpdatePublisher(natsWrapper.client).publish({
      id: product.id,
      version: product.version,
      title: product.title,
      price: product.price,
      userId: product.userId,
    });

    res.send(product);
  }
);

export { router as updateProductRouter };
