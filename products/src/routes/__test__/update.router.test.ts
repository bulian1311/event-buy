import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { createProduct } from "../../test/create-product.helper";

it("Возврощает 404 если id не существует.", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/products/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "test", price: 333 })
    .expect(404);
});

it("Возврощает 401 если пользователь не авторизован.", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/products/${id}`)
    .send({ title: "test", price: 333 })
    .expect(401);
});

it("Возврощает 401 если пользователь не владеет продуктом.", async () => {
  const product = await createProduct();

  await request(app)
    .put(`/api/products/${product.id}`)
    .set("Cookie", global.signin())
    .send({ title: "test", price: 333 })
    .expect(401);
});

it("Возврощает 400 если предоставлены неверные данные.", async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post(`/api/products`)
    .set("Cookie", cookie)
    .send({ title: "test", price: 333 });

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 333 })
    .expect(400);

  await request(app)
    .put(`/api/products/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "test", price: -1 })
    .expect(400);
});

it("Редактирует продукт по id.", async () => {
  const cookie = global.signin();

  const response1 = await request(app)
    .post(`/api/products`)
    .set("Cookie", cookie)
    .send({ title: "test", price: 333 });

  const response2 = await request(app)
    .put(`/api/products/${response1.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "changed", price: 777 })
    .expect(200);

  expect(response2.body.title).toEqual("changed");
  expect(response2.body.price).toEqual(777);
});
