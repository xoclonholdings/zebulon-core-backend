import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import trustedDevicesApp from "./trusteddevices.js";
import authRouter from "../auth.js"; // Adjust path if needed

const app = express();

// CORS FIRST!
app.use(cors({
  origin: "http://localhost:5000", // or "*" for local testing
  credentials: true,
  exposedHeaders: ["Set-Cookie"],
}));

app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: "your_secret", resave: false, saveUninitialized: true }));

// Mount trusted devices routes
app.use(trustedDevicesApp);

// Mount auth routes
app.use(authRouter);

// Example root route
app.get("/", (req, res) => {
  res.send("Express server is running.");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});