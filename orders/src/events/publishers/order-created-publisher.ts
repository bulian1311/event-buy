import { Publisher, OrderCreatedEvent, Subjects } from "@magmer/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
