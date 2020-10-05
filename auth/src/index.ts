import express from "express";
import { json } from "body-parser";

const app = express();
app.use(json());

app.listen(4000, () => {
  console.log("Auth listening on port 4000...");
});
