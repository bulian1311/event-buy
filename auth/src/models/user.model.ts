import mongoose from "mongoose";
import { PasswordHelper } from "../helpers/password.helper";

interface IUserAttr {
  email: string;
  password: string;
}

interface IUserModel extends mongoose.Model<IUserDoc> {
  build(userAttrs: IUserAttr): IUserDoc;
}

interface IUserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // Удаляем ненужные свойства в возвращаемом обьекте.
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await PasswordHelper.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (userAttrs: IUserAttr) => {
  return new User(userAttrs);
};

const User = mongoose.model<IUserDoc, IUserModel>("User", userSchema);

export { User };
