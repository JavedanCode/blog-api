import "dotenv/config";

const requiredEnvVariables = [
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_ISSUER",
  "JWT_AUDIENCE",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "GITHUB_CALLBACK_URL",
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]?.trim()) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

const jwtSecret = process.env.JWT_SECRET;

if (Buffer.byteLength(jwtSecret, "utf8") < 32) {
  throw new Error("JWT_SECRET must contain at least 32 bytes of entropy.");
}

const port = Number(process.env.PORT) || 3000;

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid port number between 1 and 65535.");
}

const nodeEnv = process.env.NODE_ENV?.trim() || "development";

const allowedNodeEnvironments = ["development", "test", "production"];

if (!allowedNodeEnvironments.includes(nodeEnv)) {
  throw new Error(
    `NODE_ENV must be one of: ${allowedNodeEnvironments.join(", ")}.`,
  );
}

export const env = {
  nodeEnv,

  port,

  databaseUrl: process.env.DATABASE_URL,

  jwt: {
    secret: jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN?.trim() || "15m",
    issuer: process.env.JWT_ISSUER.trim(),
    audience: process.env.JWT_AUDIENCE.trim(),
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID.trim(),
    clientSecret: process.env.GOOGLE_CLIENT_SECRET.trim(),
    callbackUrl: process.env.GOOGLE_CALLBACK_URL.trim(),
  },

  github: {
    clientId: process.env.GITHUB_CLIENT_ID.trim(),
    clientSecret: process.env.GITHUB_CLIENT_SECRET.trim(),
    callbackUrl: process.env.GITHUB_CALLBACK_URL.trim(),
  },

  clientUrl: process.env.CLIENT_URL?.trim() || null,
};
