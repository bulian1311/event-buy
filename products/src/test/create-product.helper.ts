import { Product, IProductAttrs } from "../models/product.model";

const createProduct = async (
  params: IProductAttrs = {
    title: "Test product",
    price: 123,
    userId: "qwerty",
  }
) => {
  const product = Product.build({
    title: params.title,
    price: params.price,
    userId: params.userId,
  });
  await product.save();

  return product;
};

export { createProduct };
