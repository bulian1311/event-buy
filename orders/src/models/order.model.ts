import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@magmer/common";

import { IProductDoc } from "./product.model";

export interface IOrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  product: IProductDoc;
}

interface IOrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  product: IProductDoc;
}

interface IOrderModel extends mongoose.Model<IOrderDoc> {
  build(attrs: IOrderAttrs): IOrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: IOrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<IOrderDoc, IOrderModel>("Order", orderSchema);

export { Order };
