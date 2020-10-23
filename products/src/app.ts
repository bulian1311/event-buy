import express from "express";
import { json } from "body-parser";

import cookieSession from "cookie-session";

import { errorHandler } from "@magmer/common";
import { NotFoundError } from "@magmer/common";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.all("*", (req, res, next) => {
  next(new NotFoundError());
});

app.use(errorHandler);

export { app };
