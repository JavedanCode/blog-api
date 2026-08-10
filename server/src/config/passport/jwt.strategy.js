import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import { env } from "../env.js";
import { getUserById } from "../../services/auth.service.js";

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwtSecret,
    algorithms: ["HS256"],
    issuer: "blog-api",
    audience: "blog-api-client",
    passReqToCallback: false,
  },

  async (payload, done) => {
    try {
      const userId = payload.sub;

      if (!userId) {
        return done(null, false);
      }

      const user = await getUserById(userId);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  },
);

export default jwtStrategy;
