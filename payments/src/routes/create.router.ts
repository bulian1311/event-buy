import express, { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  requireAuth,
  BadRequestError,
  NotFoundError,
  NotAuthError,
  OrderStatus,
} from "@magmer/common";
import { Order } from "../models/order.model";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) return next(new NotFoundError());

    if (order.userId !== req.currentUser!.id) {
      return next(new NotAuthError());
    }

    if (order.status === OrderStatus.Cancelled) {
      return next(new BadRequestError("Заказ отменен."));
    }

    console.log("Test payment...");

    res.send({ success: true });
  }
);

export { router as createChargeRouter };
