import mongoose from "mongoose";
import { OrderStatus } from "@magmer/common";
import { Order } from "../models/order.model";

export interface IProductAttrs {
  id: string;
  title: string;
  price: number;
}

export interface IProductDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

export interface IProductModel extends mongoose.Model<IProductDoc> {
  build(attrs: IProductAttrs): IProductDoc;
}

const productScheema = new mongoose.Schema(
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

productScheema.statics.build = (attrs: IProductAttrs) => {
  return new Product({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

productScheema.methods.isReserved = async function () {
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
  productScheema
);

export { Product };
