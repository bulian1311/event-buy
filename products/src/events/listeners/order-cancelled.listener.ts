import { Message } from "node-nats-streaming";
import { Subjects, Listener, OrderCancelledEvent } from "@magmer/common";
import { Product } from "../../models/product.model";
import { queueGroupName } from "./queue-group-name";
import { ProductUpdatePublisher } from "../publishers/product-update.publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueNameGroup = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const product = await Product.findById(data.product.id);

    if (!product) throw new Error("Product not found.");

    product.set({ orderId: undefined });

    await product.save();

    await new ProductUpdatePublisher(this.client).publish({
      id: product.id,
      price: product.price,
      title: product.title,
      userId: product.userId,
      orderId: product.orderId,
      version: product.version,
    });

    msg.ack();
  }
}
