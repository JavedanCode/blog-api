import { Strategy as GitHubStrategy } from "passport-github";

import { env } from "../env.js";

import { findOrCreateOAuthUser } from "../../services/auth.service.js";

import { AppError } from "../../errors/AppError.js";

async function getGitHubVerifiedEmail(accessToken) {
  const response = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2026-03-10",
    },
  });

  if (!response.ok) {
    throw new AppError(
      "Unable to retrieve your GitHub email address.",
      502,
      "OAUTH_PROVIDER_ERROR",
    );
  }

  const emails = await response.json();

  if (!Array.isArray(emails)) {
    throw new AppError(
      "Unable to retrieve your GitHub email address.",
      502,
      "OAUTH_PROVIDER_ERROR",
    );
  }
  /*
   * Prefer the primary verified email.
   */
  const primaryVerifiedEmail = emails.find(
    (email) => email.primary === true && email.verified === true,
  );

  if (primaryVerifiedEmail) {
    return primaryVerifiedEmail.email;
  }

  /*
   * Fall back to any verified email.
   */
  const verifiedEmail = emails.find((email) => email.verified === true);

  return verifiedEmail?.email ?? null;
}

const githubStrategy = new GitHubStrategy(
  {
    clientID: env.github.clientId,
    clientSecret: env.github.clientSecret,
    callbackURL: env.github.callbackUrl,
  },

  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = await getGitHubVerifiedEmail(accessToken);

      if (!email) {
        return done(
          new AppError(
            "A verified GitHub email address is required.",
            400,
            "OAUTH_EMAIL_NOT_VERIFIED",
          ),
        );
      }
      const user = await findOrCreateOAuthUser({
        provider: "GITHUB",
        providerAccountId: profile.id,
        email,
        username:
          profile.username || profile.displayName || email.split("@")[0],
      });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  },
);

export default githubStrategy;
