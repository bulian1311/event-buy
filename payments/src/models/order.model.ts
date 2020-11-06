import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@magmer/common";
import { request } from "express";

export interface IOrderAttrs {
  id: string;
  userId: string;
  version: number;
  status: OrderStatus;
  price: number;
}

interface IOrderDoc extends mongoose.Document {
  userId: string;
  version: number;
  status: OrderStatus;
  price: number;
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
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
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
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};

const Order = mongoose.model<IOrderDoc, IOrderModel>("Order", orderSchema);

export { Order };
