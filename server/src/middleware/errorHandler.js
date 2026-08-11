import { Prisma } from "@prisma/client";

import { AppError } from "../errors/AppError.js";

export function errorHandler(error, req, res, next) {
  console.error(error);

  /*
   * Already-standardized application errors.
   */
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,

        ...(error.details && {
          details: error.details,
        }),
      },
    });
  }

  /*
   * Prisma known request errors.
   */
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error, res);
  }

  /*
   * Prisma validation errors.
   */
  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: {
        code: "DATABASE_VALIDATION_ERROR",
        message: "The request contains invalid data.",
      },
    });
  }

  /*
   * Malformed JSON body.
   */
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "The request body contains invalid JSON.",
      },
    });
  }

  /*
   * JWT errors that may escape Passport.
   */
  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      error: {
        code: "TOKEN_EXPIRED",
        message: "Your authentication token has expired.",
      },
    });
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: {
        code: "INVALID_TOKEN",
        message: "The authentication token is invalid.",
      },
    });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      error: {
        code: "PAYLOAD_TOO_LARGE",
        message: "Request body is too large.",
      },
    });
  }

  /*
   * Unknown error.
   *
   * Never expose internal implementation details
   * in production.
   */
  const isDevelopment = process.env.NODE_ENV === "development";

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",

      ...(isDevelopment && {
        details: error.message,
      }),
    },
  });
}

function handlePrismaError(error, res) {
  switch (error.code) {
    /*
     * Unique constraint violation.
     */
    case "P2002":
      return res.status(409).json({
        error: {
          code: "DUPLICATE_RESOURCE",
          message: "A resource with the provided value already exists.",
        },
      });

    /*
     * Record not found.
     */
    case "P2025":
      return res.status(404).json({
        error: {
          code: "RESOURCE_NOT_FOUND",
          message: "The requested resource was not found.",
        },
      });

    /*
     * Foreign key constraint failure.
     */
    case "P2003":
      return res.status(400).json({
        error: {
          code: "INVALID_RELATION",
          message: "The request references a resource that does not exist.",
        },
      });

    /*
     * Required relation violation.
     */
    case "P2014":
      return res.status(400).json({
        error: {
          code: "INVALID_RELATION",
          message: "The requested operation violates a required relationship.",
        },
      });

    default:
      return res.status(500).json({
        error: {
          code: "DATABASE_ERROR",
          message: "A database error occurred.",
        },
      });
  }
}
