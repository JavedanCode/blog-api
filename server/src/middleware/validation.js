import { validationResult } from "express-validator";

import { AppError } from "../errors/AppError.js";

export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const details = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));

    return next(
      new AppError(
        "Request validation failed.",
        400,
        "VALIDATION_ERROR",
        details,
      ),
    );
  }

  next();
}
