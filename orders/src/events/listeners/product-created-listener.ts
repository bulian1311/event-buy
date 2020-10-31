import { Message } from "node-nats-streaming";
import { Subjects, Listener, ProductCreatedEvent } from "@magmer/common";
import { Product } from "../../models/product.model";
import { queueGroupName } from "./queue-group-name";

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
  queueNameGroup = queueGroupName;

  async onMessage(data: ProductCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    const product = Product.build({
      id,
      title,
      price,
    });
    await product.save();

    msg.ack();
  }
}
