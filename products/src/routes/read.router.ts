import express, { Request, Response, NextFunction } from "express";
import { NotFoundError } from "@magmer/common";

import { Product } from "../models/product.model";

const router = express.Router();

router.get(
  "/api/products/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) return next(new NotFoundError());

      res.send(product);
    } catch (err) {
      next(new NotFoundError());
    }
  }
);

export { router as readProductRouter };
