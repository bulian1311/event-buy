import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@magmer/common";
import { OrderCreatedListener } from "../order-created.listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Product } from "../../../models/product.model";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const product = Product.build({
    title: "Test product",
    price: 123,
    userId: "qwe",
  });
  await product.save();

  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "qwe",
    expiresAt: "xxx",
    product: {
      id: product.id,
      price: product.price,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, product };
};

it("Устанавливает orderId для продукта", async () => {
  const { listener, data, msg, product } = await setup();

  await listener.onMessage(data, msg);

  const updatedProduct = await Product.findById(product.id);

  expect(updatedProduct!.orderId).toEqual(data.id);
});

it("Подтверждает получение сообщения от NATS.", async () => {
  const { listener, data, msg, product } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("Излучает событие изменения продукта, при добавлении заказа.", async () => {
  const { listener, data, msg, product } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const productUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(productUpdatedData.orderId);
});
