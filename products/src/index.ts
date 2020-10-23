import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY must be defined.");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI must be defined.");

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Product service connected to mongodb...");
  } catch (err) {
    console.error(err);
  }

  app.listen(4000, () => {
    console.log("Products service listening on port 4000...");
  });
};

start();
