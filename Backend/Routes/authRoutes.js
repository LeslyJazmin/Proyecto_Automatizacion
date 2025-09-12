import express from "express";
import { login } from "../Controllers/authController.js";

const router = express.Router();

router.post("/login", login);

export default router;
