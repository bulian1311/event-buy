import { Publisher, ProductUpdatedEvent, Subjects } from "@magmer/common";

export class ProductUpdatePublisher extends Publisher<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
}
