import { Message } from "node-nats-streaming";
import { Listener, ProductCreatedEvent, Subjects } from "@magmer/common";

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
  queueNameGroup = "test-service";

  onMessage(data: ProductCreatedEvent["data"], msg: Message) {
    console.log("Event data ", data);
    msg.ack();
  }
}
