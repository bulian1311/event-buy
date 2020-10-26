import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { ProductCreatedPublisher } from "./events/product-created-publisher";

console.clear();

const stanId = randomBytes(4).toString("hex");

const stan = nats.connect("producting", stanId, {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connect to NATS...");

  const publisher = new ProductCreatedPublisher(stan);
  await publisher.publish({
    id: "qweqwe",
    title: "test",
    price: 123,
    userId: "zxczxc",
  });
});
