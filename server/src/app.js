import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import passport from "./config/passport/index.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";

import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { AppError } from "./errors/AppError.js";

import { apiLimiter } from "./middleware/rateLimiter.js";

import { env } from "./config/env.js";

import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./docs/openapi.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.corsOrigins,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: false,
  }),
);

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

app.use(morgan("dev"));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(passport.initialize());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Blog API is running",
  });
});

app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", commentRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;
