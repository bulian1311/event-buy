import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { ExpirationCompleteEvent, OrderStatus } from "@magmer/common";
import { ExpirationCompleteListener } from "../expiration-complete.listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Product } from "../../../models/product.model";
import { Order } from "../../../models/order.model";

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Test product",
    price: 123,
  });
  await product.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: "sdfsfsdf",
    expiresAt: new Date(),
    product,
  });
  await order.save();

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order, product };
};

it("Изменяет статус заказа на отмененный.", async () => {
  const { listener, data, msg, order, product } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Отправляет событие отмены заказа в NATS. ", async () => {
  const { listener, data, msg, order, product } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it("Подтверждает получение события от NATS.", async () => {
  const { listener, data, msg, order, product } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
