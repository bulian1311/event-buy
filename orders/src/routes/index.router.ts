import express, { Request, Response, NextFunction } from "express";
import { NotFoundError, requireAuth } from "@magmer/common";

import { Order } from "../models/order.model";

const router = express.Router();

router.get(
  "/api/orders",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const orders = await Order.find({ userId: req.currentUser!.id }).populate(
      "product"
    );

    if (!orders) return next(new NotFoundError());

    res.send(orders);
  }
);

export { router as indexOrdersRouter };
