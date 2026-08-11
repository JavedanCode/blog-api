import passport from "../config/passport/index.js";

import { AppError } from "../errors/AppError.js";

export function authenticate(req, res, next) {
  passport.authenticate(
    "jwt",
    {
      session: false,
    },
    (error, user) => {
      if (error) {
        return next(error);
      }

      if (!user) {
        return next(
          new AppError(
            "Authentication required.",
            401,
            "INVALID_OR_MISSING_TOKEN",
          ),
        );
      }

      req.user = user;

      next();
    },
  )(req, res, next);
}
