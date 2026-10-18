import "dotenv/config";
import express from "express";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import { functions } from "./inngest/functions/index.js";

const app = express();
app.use(express.json());

app.use(
  // Expose the middleware on our recommended path at `/api/inngest`.
  "/api/inngest",
  serve({ client: inngest, functions }),
);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
