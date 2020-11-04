import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { ProductCreatedEvent } from "@magmer/common";
import { ProductCreatedListener } from "../product-created.listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Product } from "../../../models/product.model";

const setup = async () => {
  const listener = new ProductCreatedListener(natsWrapper.client);

  const data: ProductCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Test product",
    price: 123,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("Создает и сохраняет продукт.", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const product = await Product.findById(data.id);

  expect(product).toBeDefined();
  expect(product!.title).toEqual(data.title);
  expect(product!.price).toEqual(data.price);
});

it("Подтверждает получение сообщения от NATS.", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
