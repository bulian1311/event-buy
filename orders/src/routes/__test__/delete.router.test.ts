import request from "supertest";
import { OrderStatus } from "@magmer/common";

import { app } from "../../app";
import { Order } from "../../models/order.model";
import { createProduct } from "../../test/create-product.helper";

import { natsWrapper } from "../../nats-wrapper";

it("Помечает заказ как отмененный.", async () => {
  const product = await createProduct();

  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ productId: product.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Излучает сабытие отмены заказа", async () => {
  const product = await createProduct();

  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ productId: product.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
