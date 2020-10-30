import request from "supertest";

import { app } from "../../app";

import { createProduct } from "../../test/create-product.helper";

it("Получить заказ пользователя.", async () => {
  const product = await createProduct();

  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ productId: product.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("Возвращает ошибку если один пользователь пытается получить заказ другого пользователя.", async () => {
  const product = await createProduct();

  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ productId: product.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(401);
});
