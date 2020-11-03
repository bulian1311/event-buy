import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

import { OrderCreatedListener } from "./events/listeners/order-created.listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled.listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined.");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined.");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("MATS_CLIENT_ID must be defined.");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined.");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined.");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed.....");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    //Слушаем события от NATS
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

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
