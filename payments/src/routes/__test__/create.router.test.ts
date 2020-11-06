import { OrderStatus } from "@magmer/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order.model";

it("Возвращает 404, если заказа не существует.", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "dsfsdfsdf",
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("Возвращает 401, если пользователь не авторизован.", async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    price: 123,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "dsfsdfsdf",
      orderId: order.id,
    })
    .expect(401);
});

it("Возвращает 400, если заказ был отменен.", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    status: OrderStatus.Cancelled,
    price: 123,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "dsfsdfsdf",
      orderId: order.id,
    })
    .expect(400);
});
