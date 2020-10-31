import mongoose from "mongoose";
import { Product, IProductAttrs } from "../models/product.model";

const createProduct = async (
  params: IProductAttrs = {
    id: mongoose.Types.ObjectId().toHexString(),
    title: "Test product",
    price: 123,
  }
) => {
  const product = Product.build({
    id: params.id,
    title: params.title,
    price: params.price,
  });
  await product.save();

  return product;
};

export { createProduct };
