import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCreatedEvent } from "@magmer/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order.model";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueNameGroup = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.product.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await order.save();

    msg.ack();
  }
}
