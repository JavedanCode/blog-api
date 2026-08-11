export const authSchemas = {
  RegisterRequest: {
    type: "object",

    properties: {
      username: {
        type: "string",
        minLength: 3,
        maxLength: 30,
        pattern: "^[a-zA-Z0-9_]+$",
        example: "JavedanCode",
      },

      email: {
        type: "string",
        format: "email",
        example: "user@example.com",
      },

      password: {
        type: "string",
        minLength: 8,
        maxLength: 128,
        format: "password",
        example: "securePassword123",
      },
    },

    required: ["username", "email", "password"],

    additionalProperties: false,
  },

  LoginRequest: {
    type: "object",

    properties: {
      identifier: {
        type: "string",
        example: "JavedanCode",
        description: "Username or email address.",
      },

      password: {
        type: "string",
        minLength: 1,
        maxLength: 128,
        format: "password",
        example: "securePassword123",
      },
    },

    required: ["identifier", "password"],

    additionalProperties: false,
  },

  AuthResponse: {
    type: "object",

    properties: {
      message: {
        type: "string",
        example: "Login successful.",
      },

      user: {
        $ref: "#/components/schemas/User",
      },

      accessToken: {
        type: "string",
        description: "JWT access token.",
        example: "eyJhbGciOiJIUzI1NiIs...",
      },
    },

    required: ["message", "user", "accessToken"],
  },

  MeResponse: {
    type: "object",

    properties: {
      user: {
        $ref: "#/components/schemas/User",
      },
    },

    required: ["user"],
  },
};
