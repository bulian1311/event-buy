import mongoose from "mongoose";
import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error("JWT ключ должен быть определен.");

  try {
    await mongoose.connect(`mongodb://auth-mongo-srv:27017/auth`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connected to mongodb...");
  } catch (err) {
    console.error(err);
  }

  app.listen(4000, () => {
    console.log("Auth listening on port 4000...");
  });
};

start();
