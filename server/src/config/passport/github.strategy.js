import { Strategy as GitHubStrategy } from "passport-github";

import { env } from "../env.js";

import { findOrCreateOAuthUser } from "../../services/auth.service.js";

const githubStrategy = new GitHubStrategy(
  {
    clientID: env.github.clientId,
    clientSecret: env.github.clientSecret,
    callbackURL: env.github.callbackUrl,
  },

  async (accessToken, refreshToken, profile, done) => {
    try {
      const emailEntry = profile.emails?.find((entry) => entry.verified);

      if (!emailEntry) {
        return done(
          new Error("GitHub account does not have a verified email address."),
        );
      }

      const user = await findOrCreateOAuthUser({
        provider: "GITHUB",
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

export default githubStrategy;
