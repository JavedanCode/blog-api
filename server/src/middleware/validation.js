import { validationResult } from "express-validator";

import { AppError } from "../errors/AppError.js";

export function handleValidationErrors(req, res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array();

  const details = errors.flatMap((error) => {
    if (error.type === "unknown_fields") {
      return error.fields.map((field) => ({
        field: field.path,
        location: field.location,
        message: "This field is not allowed.",
      }));
    }

    return [
      {
        field: error.path,
        location: error.location,
        message: error.msg,
      },
    ];
  });

  return next(
    new AppError(
      "Request validation failed.",
      400,
      "VALIDATION_ERROR",
      details,
    ),
  );
}
