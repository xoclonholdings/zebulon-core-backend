import { Router } from "express";

export const memoryRouter = Router();

memoryRouter.get("/", (req, res) => {
  res.json({ status: "memory online" });
});
