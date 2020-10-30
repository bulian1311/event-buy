import express, { Request, Response, NextFunction } from "express";
import { NotFoundError, requireAuth, NotAuthError } from "@magmer/common";

import { Order } from "../models/order.model";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.orderId).populate("product");

    if (!order) return next(new NotFoundError());

    if (order.userId !== req.currentUser!.id) {
      return next(new NotAuthError());
    }

    res.send(order);
  }
);

export { router as readOrdersRouter };
