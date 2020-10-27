import request from "supertest";
import { app } from "../../app";
import { Product } from "../../models/product.model";
import { natsWrapper } from "../../nats-wrapper";

it("Роутер слушает api/products для POST запроса.", async () => {
  const response = await request(app).post("/api/products").send({});

  expect(response.status).not.toEqual(404);
});

it("Возвращает код 401, если пользователь не авторизован.", async () => {
  await request(app).post("/api/products").send({}).expect(401);
});

it("Возвращает код отличный от 401, если пользователь авторизован.", async () => {
  const response = await request(app)
    .post("/api/products")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("Возвращает ошибку, если не предоставлен заголовок продукта.", async () => {
  await request(app)
    .post("/api/products")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 123,
    })
    .expect(400);

  await request(app)
    .post("/api/products")
    .set("Cookie", global.signin())
    .send({
      price: 123,
    })
    .expect(400);
});

it("Возвращает ошибку, если не предоставлена цена.", async () => {
  await request(app)
    .post("/api/products")
    .set("Cookie", global.signin())
    .send({
      title: "Test product",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/products")
    .set("Cookie", global.signin())
    .send({
      title: "Test product",
    })
    .expect(400);
});

it("Создает продукт с необходимыми параметрами.", async () => {
  let products = await Product.find({});
  expect(products.length).toEqual(0);

  await request(app)
    .post("/api/products")
    .set("Cookie", global.signin())
    .send({
      title: "Test product",
      price: 123,
    })
    .expect(201);

  products = await Product.find({});
  expect(products.length).toEqual(1);
  expect(products[0].title).toEqual("Test product");
});

it("Публикует событие в NATS.", async () => {
  await request(app)
    .post("/api/products")
    .set("Cookie", global.signin())
    .send({
      title: "Test product",
      price: 123,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
