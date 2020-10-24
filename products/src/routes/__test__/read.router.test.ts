import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Product } from "../../models/product.model";

it("Возвращает статус 404, если продукт не найден.", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/products/${id}`).send({}).expect(404);
});

it("Возвращает продукт, если продукт не найден.", async () => {
  const product = Product.build({
    title: "Test product",
    price: 123,
    userId: "qwerty",
  });

  await product.save();

  const response = await request(app)
    .get(`/api/products/${product.id}`)
    .send({})
    .expect(200);

  expect(response.body.id).toEqual(product.id);
});
