import request from "supertest";
import mongoose from "mongoose";
import { OrderStatus } from "@magmer/common";

import { app } from "../../app";
import { Order } from "../../models/order.model";
import { Product } from "../../models/product.model";

it("Возвращает ошибку, если продукта не существует.", async () => {
  const productId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ productId })
    .expect(404);
});

it("Возвращает ошибку, если продукт зарезервирован.", async () => {
  const product = Product.build({ title: "Test product", price: 123 });
  await product.save();

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
  const product = Product.build({ title: "Test product", price: 123 });
  await product.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ productId: product.id })
    .expect(201);
});

it.todo("Излучитиь событие о создании заказа");
