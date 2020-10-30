import express, { Request, Response, NextFunction } from "express";
import {
  NotFoundError,
  OrderStatus,
  requireAuth,
  NotAuthError,
} from "@magmer/common";

import { Order } from "../models/order.model";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) return next(new NotFoundError());

    if (order.userId !== req.currentUser!.id) {
      return next(new NotAuthError());
    }

    order.status = OrderStatus.Canceled;
    await order.save();

    res.status(204).send(order);
  }
);

export { router as deleteOrdersRouter };
