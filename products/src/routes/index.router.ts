import express, { Request, Response, NextFunction } from "express";
import { NotFoundError } from "@magmer/common";

import { Product } from "../models/product.model";

const router = express.Router();

router.get(
  "/api/products",
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find({});

    if (!products) return next(new NotFoundError());

    res.send(products);
  }
);

export { router as indexProductRouter };
