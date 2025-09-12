import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",  // <-- muy importante
  credentials: true,
}));

app.use(express.json());
app.use("/api/auth", authRoutes);

export default app;
