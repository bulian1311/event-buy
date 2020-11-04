import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { ProductUpdatedEvent } from "@magmer/common";
import { ProductUpdatedListener } from "../product-updated.listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Product } from "../../../models/product.model";

const setup = async () => {
  const listener = new ProductUpdatedListener(natsWrapper.client);

  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Test product",
    price: 123,
  });
  await product.save();

  const data: ProductUpdatedEvent["data"] = {
    version: product.version + 1,
    id: product.id,
    title: "new Test product",
    price: 999,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, product };
};

it("Находит, изменяет и сохраняет продукт.", async () => {
  const { listener, data, msg, product } = await setup();

  await listener.onMessage(data, msg);

  const updatedProduct = await Product.findById(product.id);

  expect(updatedProduct!.title).toEqual(data.title);
  expect(updatedProduct!.price).toEqual(data.price);
  expect(updatedProduct!.version).toEqual(data.version);
});

it("Подтверждает получение сообщения от NATS.", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("Не подтверждает сообщение, если событие пропущено.", async () => {
  const { listener, data, msg, product } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
