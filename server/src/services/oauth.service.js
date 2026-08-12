import crypto from "crypto";

import prisma from "../lib/prisma.js";
import { AppError } from "../errors/AppError.js";

const OAUTH_CODE_TTL_MS = 2 * 60 * 1000;

function hashCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export async function createOAuthCode(userId) {
  await prisma.oAuthCode.deleteMany({
    where: {
      OR: [
        {
          expiresAt: {
            lt: new Date(),
          },
        },
        {
          usedAt: {
            not: null,
          },
        },
      ],
    },
  });
  const rawCode = crypto.randomBytes(32).toString("hex");

  const codeHash = hashCode(rawCode);

  const expiresAt = new Date(Date.now() + OAUTH_CODE_TTL_MS);

  await prisma.oAuthCode.create({
    data: {
      codeHash,
      userId,
      expiresAt,
    },
  });

  return rawCode;
}

export async function consumeOAuthCode(code) {
  if (!code || typeof code !== "string") {
    throw new AppError("Invalid OAuth code.", 400, "INVALID_OAUTH_CODE");
  }

  const codeHash = hashCode(code);

  const oauthCode = await prisma.oAuthCode.findUnique({
    where: {
      codeHash,
    },
    include: {
      user: true,
    },
  });

  if (!oauthCode) {
    throw new AppError("Invalid OAuth code.", 400, "INVALID_OAUTH_CODE");
  }

  if (oauthCode.usedAt) {
    throw new AppError(
      "This OAuth code has already been used.",
      400,
      "OAUTH_CODE_ALREADY_USED",
    );
  }

  if (oauthCode.expiresAt <= new Date()) {
    throw new AppError(
      "This OAuth code has expired.",
      400,
      "OAUTH_CODE_EXPIRED",
    );
  }

  const consumed = await prisma.oAuthCode.updateMany({
    where: {
      id: oauthCode.id,
      usedAt: null,
    },
    data: {
      usedAt: new Date(),
    },
  });

  if (consumed.count !== 1) {
    throw new AppError(
      "This OAuth code has already been used.",
      400,
      "OAUTH_CODE_ALREADY_USED",
    );
  }

  return oauthCode.user;
}
