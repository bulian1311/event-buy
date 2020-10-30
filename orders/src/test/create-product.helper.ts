import { Product, IProductAttrs } from "../models/product.model";

const createProduct = async (
  params: IProductAttrs = {
    title: "Test product",
    price: 123,
  }
) => {
  const product = Product.build({
    title: params.title,
    price: params.price,
  });
  await product.save();

  return product;
};

export { createProduct };
