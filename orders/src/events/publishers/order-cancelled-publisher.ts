import { Publisher, OrderCancelledEvent, Subjects } from "@magmer/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
