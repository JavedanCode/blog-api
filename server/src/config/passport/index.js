import passport from "passport";

import { env } from "../env.js";

import localStrategy from "./local.strategy.js";
import jwtStrategy from "./jwt.strategy.js";
import googleStrategy from "./google.strategy.js";
import githubStrategy from "./github.strategy.js";

passport.use("local", localStrategy);
passport.use("jwt", jwtStrategy);

if (env.google.clientId && env.google.clientSecret && env.google.callbackUrl) {
  passport.use("google", googleStrategy);
}

if (env.github.clientId && env.github.clientSecret && env.github.callbackUrl) {
  passport.use("github", githubStrategy);
}

export default passport;
