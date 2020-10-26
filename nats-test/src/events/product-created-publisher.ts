import { Publisher, ProductCreatedEvent, Subjects } from "@magmer/common";

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
}
