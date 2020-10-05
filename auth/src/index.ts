import express from "express";
import { json } from "body-parser";

import { signinRouter } from "./routes/signin.route";
import { signoutRouter } from "./routes/signout.route";
import { signupRouter } from "./routes/signup.route";
import { currentUserRouter } from "./routes/current-user.route";

const app = express();
app.use(json());

app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(currentUserRouter);

app.listen(4000, () => {
  console.log("Auth listening on port 4000...");
});
