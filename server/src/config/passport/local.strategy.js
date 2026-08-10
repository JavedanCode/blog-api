import { Strategy as LocalStrategy } from "passport-local";

import { verifyLocalCredentials } from "../../services/auth.service.js";

const localStrategy = new LocalStrategy(
  {
    usernameField: "identifier",
    passwordField: "password",
    session: false,
  },

  async (identifier, password, done) => {
    try {
      const user = await verifyLocalCredentials(identifier, password);

      if (!user) {
        return done(null, false, {
          message: "Invalid credentials.",
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  },
);

export default localStrategy;
