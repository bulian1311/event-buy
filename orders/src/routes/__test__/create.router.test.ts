import request from "supertest";
import mongoose from "mongoose";
import { OrderStatus } from "@magmer/common";

import { app } from "../../app";
import { Order } from "../../models/order.model";

import { createProduct } from "../../test/create-product.helper";

import { natsWrapper } from "../../nats-wrapper";

it("Возвращает ошибку, если продукта не существует.", async () => {
  const productId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ productId })
    .expect(404);
});

it("Возвращает ошибку, если продукт зарезервирован.", async () => {
  const product = await createProduct();

  const order = Order.build({
    product,
    userId: "qweqwe",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ productId: product.id })
    .expect(400);
});

it("Резервирует продукт.", async () => {
  const product = await createProduct();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ productId: product.id })
    .expect(201);
});

it("Излучитиь событие о создании заказа", async () => {
  const product = await createProduct();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ productId: product.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
