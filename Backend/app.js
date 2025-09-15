const express = require("express");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes");
const { connectDB } = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);

module.exports = app;
