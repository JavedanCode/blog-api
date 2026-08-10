import passport from "../config/passport/index.js";

export const authenticate = passport.authenticate("jwt", {
  session: false,
});
