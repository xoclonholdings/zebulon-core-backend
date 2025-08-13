import { Express } from "express";
import updatesRouter from "./router";

export default function mountUpdates(app: Express) {
  app.use("/api", updatesRouter);
}
