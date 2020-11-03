import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledEvent, OrderStatus } from "@magmer/common";
import { OrderCancelledListener } from "../order-cancelled.listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Product } from "../../../models/product.model";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const product = Product.build({
    title: "Test product",
    price: 123,
    userId: "qwe",
  });
  product.set({
    orderId: mongoose.Types.ObjectId().toHexString(),
  });
  await product.save();

  const data: OrderCancelledEvent["data"] = {
    id: product.orderId!,
    version: 0,
    product: {
      id: product.id,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, product };
};

it("Обновляет orderId для продукта", async () => {
  const { listener, data, msg, product } = await setup();

  await listener.onMessage(data, msg);

  const updatedProduct = await Product.findById(product.id);

  expect(updatedProduct!.orderId).not.toBeDefined();
});

it("Подтверждает получение сообщения от NATS.", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("Излучает событие изменения продукта, при отмене заказа.", async () => {
  const { listener, data, msg, product } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
