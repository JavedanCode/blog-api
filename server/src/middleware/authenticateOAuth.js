import passport from "../config/passport/index.js";

import { AppError } from "../errors/AppError.js";

export function authenticateOAuth(strategy, options = {}) {
  return (req, res, next) => {
    passport.authenticate(
      strategy,
      {
        session: false,
        ...options,
      },
      (error, user) => {
        if (error) {
          return next(error);
        }

        if (!user) {
          return next(
            new AppError(
              "OAuth authentication failed.",
              401,
              "OAUTH_AUTHENTICATION_FAILED",
            ),
          );
        }

        req.user = user;

        next();
      },
    )(req, res, next);
  };
}
