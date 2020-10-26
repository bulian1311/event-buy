import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { ProductCreatedListener } from "./events/product-created-listener";

console.clear();

const stanId = randomBytes(4).toString("hex");

const stan = nats.connect("producting", stanId, {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS...");

  stan.on("close", () => {
    console.log("NATS connection closed.....");
    process.exit();
  });

  new ProductCreatedListener(stan).listen();
});

//Закрываем клиент nats при прекращении работы процесса.
process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
