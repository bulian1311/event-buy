import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  OrderStatus,
} from "@magmer/common";

import { Order } from "../models/order.model";
import { Product } from "../models/product.model";

import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("productId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("productId must be provided."),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) return next(new NotFoundError());

    const isReserved = await product.isReserved();

    if (isReserved) {
      return next(new BadRequestError("Заказ уже существует."));
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      product: product,
    });
    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      product: {
        id: product.id,
        price: product.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrdersRouter };
