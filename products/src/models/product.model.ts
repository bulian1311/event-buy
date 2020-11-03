import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface IProductAttrs {
  title: string;
  price: number;
  userId: string;
}

interface IProductDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

interface IProductModel extends mongoose.Model<IProductDoc> {
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
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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

productScheema.set("versionKey", "version");
productScheema.plugin(updateIfCurrentPlugin);

productScheema.statics.build = (attrs: IProductAttrs) => {
  return new Product(attrs);
};

const Product = mongoose.model<IProductDoc, IProductModel>(
  "Product",
  productScheema
);

export { Product };
