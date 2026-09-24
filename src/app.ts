import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoutes } from "./modules/users/user.route";
import { authRoutes } from "./modules/auth/auth.route";
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello Gearup",
    author: "Sabbir vai",
  });
});

app.use("/api/auth", userRoutes)
app.use("/api/auth", authRoutes)

export default app;
