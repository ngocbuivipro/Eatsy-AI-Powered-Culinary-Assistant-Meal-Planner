import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { notFound, errorHandler } from "./middleware/error.middleware.js";
import userRoutes from "./modules/user/user.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Eatsy Backend is running");
});

app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
