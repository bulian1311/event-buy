import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedEvent, OrderStatus } from "@magmer/common";
import { OrderCreatedListener } from "../order-created.listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order.model";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "qwe",
    expiresAt: "xxx",
    product: {
      id: "product.id",
      price: 123,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("Создает заказ в базе данных.", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.id).toEqual(data.id);
  expect(order!.price).toEqual(data.product.price);
});

it("Подтверждает получение сообщения от NATS.", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
