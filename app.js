import "dotenv/config";
import routes from "./routes/index.js";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(routes);

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
