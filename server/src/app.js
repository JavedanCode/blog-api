import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import passport from "./config/passport/index.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import postRoutes from "./routes/post.routes.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: true,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(morgan("dev"));

app.use(passport.initialize());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Blog API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/posts", postRoutes);

app.use(errorHandler);

export default app;
