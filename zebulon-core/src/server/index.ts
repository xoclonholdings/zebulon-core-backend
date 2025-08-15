import express from "express";
import cookieParser from "cookie-parser";
import { memoryRouter } from "../memory";

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

// Mount memory & AI routes
app.use("/memory", memoryRouter);

app.get("/", (req, res) => {
  res.send("Zebulon Core Backend Online");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
