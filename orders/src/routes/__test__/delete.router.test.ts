import request from "supertest";
import mongoose from "mongoose";
import { OrderStatus } from "@magmer/common";

import { app } from "../../app";
import { Order } from "../../models/order.model";
import { Product } from "../../models/product.model";
import { createProduct } from "../../test/create-product.helper";

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

  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

it.todo("Излучает сабытие отмены заказа");
