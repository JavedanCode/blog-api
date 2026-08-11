import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { env } from "../env.js";

import { findOrCreateOAuthUser } from "../../services/auth.service.js";

import { AppError } from "../../errors/AppError.js";

const googleStrategy = new GoogleStrategy(
  {
    clientID: env.google.clientId,
    clientSecret: env.google.clientSecret,
    callbackURL: env.google.callbackUrl,
  },

  async (accessToken, refreshToken, profile, done) => {
    try {
      const emailEntry = profile.emails?.find((entry) => entry.verified);

      if (!emailEntry) {
        return done(
          new AppError(
            "A verified Google email address is required.",
            400,
            "OAUTH_EMAIL_NOT_VERIFIED",
          ),
        );
      }

      const user = await findOrCreateOAuthUser({
        provider: "GOOGLE",
        providerAccountId: profile.id,
        email: emailEntry.value,
        username:
          profile.username ||
          profile.displayName ||
          emailEntry.value.split("@")[0],
      });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  },
);

export default googleStrategy;
