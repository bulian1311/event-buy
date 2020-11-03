import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@magmer/common";
import { body } from "express-validator";

import { Product } from "../models/product.model";
import { ProductCreatedPublisher } from "../events/publishers/product-created.publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/api/products",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Заголовок не должен быть пустым."),
    body("price")
      .notEmpty()
      .isInt({ gt: 0 })
      .withMessage("Цена должна быть больше 0."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const product = Product.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await product.save();

    new ProductCreatedPublisher(natsWrapper.client).publish({
      id: product.id,
      version: product.version,
      title: product.title,
      price: product.price,
      userId: product.userId,
    });

    res.status(201).send(product);
  }
);

export { router as createProductRouter };
