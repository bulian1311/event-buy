import express from "express";
import { json } from "body-parser";
import mongoose from "mongoose";

import { signinRouter } from "./routes/signin.route";
import { signoutRouter } from "./routes/signout.route";
import { signupRouter } from "./routes/signup.route";
import { currentUserRouter } from "./routes/current-user.route";

import { errorHandler } from "./middlewares/error-handler.mid";
import { NotFoundError } from "./errors/not-found.error";

const app = express();
app.use(json());

app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(currentUserRouter);

app.all("*", (req, res, next) => {
  next(new NotFoundError());
});
app.use(errorHandler);

const start = async () => {
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
