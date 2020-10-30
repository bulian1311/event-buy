import express from "express";
import { json } from "body-parser";

import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@magmer/common";

import { createOrdersRouter } from "./routes/create.router";
import { readOrdersRouter } from "./routes/read.router";
import { deleteOrdersRouter } from "./routes/delete.router";
import { indexOrdersRouter } from "./routes/index.router";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

app.use(createOrdersRouter);
app.use(deleteOrdersRouter);
app.use(readOrdersRouter);
app.use(indexOrdersRouter);

app.all("*", (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
