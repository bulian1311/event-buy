import request from "supertest";
import { app } from "../../app";
import { createProduct } from "../../test/create-product.helper";

it("Возвращает список продуктов.", async () => {
  await createProduct();
  await createProduct();
  await createProduct();

  const response = await request(app).get(`/api/products`).send({}).expect(200);

  expect(response.body.length).toEqual(3);
});
