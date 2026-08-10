import bcrypt from "bcryptjs";

import prisma from "../lib/prisma.js";
import { sanitizeUser } from "../utils/user.js";

const SALT_ROUNDS = 12;

/**
 * Find a user by their ID.
 */
export async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
}

/**
 * Create a new local user account.
 */
export async function createLocalUser({ username, email, password }) {
  const normalizedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username: normalizedUsername,
        },
        {
          email: normalizedEmail,
        },
      ],
    },
  });

  if (existingUser) {
    if (existingUser.username === normalizedUsername) {
      const error = new Error("Username is already in use.");
      error.statusCode = 409;
      throw error;
    }

    if (existingUser.email === normalizedEmail) {
      const error = new Error("Email is already in use.");
      error.statusCode = 409;
      throw error;
    }
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      username: normalizedUsername,
      email: normalizedEmail,
      accounts: {
        create: {
          provider: "LOCAL",
          providerAccountId: normalizedEmail,
          passwordHash,
        },
      },
    },
  });

  return sanitizeUser(user);
}

/**
 * Verify local login credentials.
 *
 * The identifier can be either:
 * - username
 * - email
 */
export async function verifyLocalCredentials(identifier, password) {
  const normalizedIdentifier = identifier.trim();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username: normalizedIdentifier,
        },
        {
          email: normalizedIdentifier.toLowerCase(),
        },
      ],
    },
    include: {
      accounts: {
        where: {
          provider: "LOCAL",
        },
      },
    },
  });

  if (!user || user.accounts.length === 0) {
    return null;
  }

  const localAccount = user.accounts[0];

  if (!localAccount.passwordHash) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    localAccount.passwordHash,
  );

  if (!passwordMatches) {
    return null;
  }

  return sanitizeUser(user);
}

/**
 * Find or create a user for an OAuth provider.
 *
 * This function handles:
 *
 * 1. Existing provider account
 * 2. Existing user with the same verified email
 * 3. Completely new OAuth user
 */
export async function findOrCreateOAuthUser({
  provider,
  providerAccountId,
  email,
  username,
}) {
  if (!provider) {
    throw new Error("OAuth provider is required.");
  }

  if (!providerAccountId) {
    throw new Error("OAuth provider account ID is required.");
  }

  if (!email) {
    const error = new Error(
      "A verified email address is required for OAuth authentication.",
    );

    error.statusCode = 400;

    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();

  /*
   * First: look for the exact provider account.
   *
   * Example:
   *
   * provider = GOOGLE
   * providerAccountId = 123456789
   */
  const existingAccount = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId,
      },
    },
    include: {
      user: true,
    },
  });

  if (existingAccount) {
    return existingAccount.user;
  }

  /*
   * Second: check whether this email already belongs
   * to one of our users.
   *
   * Since the provider email has already been verified
   * by the OAuth strategy, we can link this provider
   * to the existing account.
   */
  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    await prisma.account.create({
      data: {
        provider,
        providerAccountId,
        userId: existingUser.id,
      },
    });

    return existingUser;
  }

  /*
   * Third: completely new OAuth user.
   *
   * Generate an application username instead of
   * blindly trusting the provider's username.
   */
  const generatedUsername = await generateUniqueUsername(
    username || normalizedEmail.split("@")[0],
  );

  const user = await prisma.user.create({
    data: {
      username: generatedUsername,
      email: normalizedEmail,
      accounts: {
        create: {
          provider,
          providerAccountId,
        },
      },
    },
  });

  return user;
}

/**
 * Generate a username that is valid and unique
 * within our application.
 */
async function generateUniqueUsername(baseUsername) {
  let base = baseUsername
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (!base) {
    base = "user";
  }

  /*
   * Keep generated usernames reasonably sized.
   */
  base = base.slice(0, 24);

  let username = base;
  let counter = 1;

  while (true) {
    const existingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!existingUser) {
      return username;
    }

    username = `${base}_${counter}`;
    counter += 1;
  }
}
