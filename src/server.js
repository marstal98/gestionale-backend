import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotte
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Avvio server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server avviato su http://localhost:${PORT}`));
