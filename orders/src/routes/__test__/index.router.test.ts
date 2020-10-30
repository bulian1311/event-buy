import request from "supertest";

import { app } from "../../app";
import { createProduct } from "../../test/create-product.helper";

it("Получает заказы аутентифицированного пользователя.", async () => {
  const product1 = await createProduct();
  const product2 = await createProduct();
  const product3 = await createProduct();

  const user1 = global.signin();
  const user2 = global.signin();

  await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({ productId: product1.id })
    .expect(201);

  const { body: order1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ productId: product2.id })
    .expect(201);

  const { body: order2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user2)
    .send({ productId: product3.id })
    .expect(201);

  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", user2)
    .expect(200);

  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(order1.id);
  expect(response.body[1].id).toEqual(order2.id);
});
