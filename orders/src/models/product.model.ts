import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@magmer/common";
import { Order } from "../models/order.model";

export interface IProductAttrs {
  id: string;
  title: string;
  price: number;
}

export interface IProductDoc extends mongoose.Document {
  version: number;
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

export interface IProductModel extends mongoose.Model<IProductDoc> {
  build(attrs: IProductAttrs): IProductDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<IProductDoc | null>;
}

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

productSchema.set("versionKey", "version");
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attrs: IProductAttrs) => {
  return new Product({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

productSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Product.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

productSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    product: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Product = mongoose.model<IProductDoc, IProductModel>(
  "Product",
  productSchema
);

export { Product };
