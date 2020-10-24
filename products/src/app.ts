import express from "express";
import { json } from "body-parser";

import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@magmer/common";

import { createProductRouter } from "./routes/create.router";
import { readProductRouter } from "./routes/read.router";
import { updateProductRouter } from "./routes/update.router";
import { indexProductRouter } from "./routes/index.router";

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

app.use(createProductRouter);
app.use(updateProductRouter);
app.use(readProductRouter);
app.use(indexProductRouter);

app.all("*", (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
