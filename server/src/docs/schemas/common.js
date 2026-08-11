export const commonSchemas = {
  User: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "197e60f9-0a26-4a2a-9011-779068080e9d",
      },

      username: {
        type: "string",
        example: "JavedanCode",
      },

      email: {
        type: "string",
        format: "email",
        example: "user@example.com",
      },

      role: {
        type: "string",
        enum: ["USER", "ADMIN"],
        example: "USER",
      },

      createdAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-11T10:30:00.000Z",
      },

      updatedAt: {
        type: "string",
        format: "date-time",
        example: "2026-08-11T10:30:00.000Z",
      },
    },

    required: ["id", "username", "email", "role", "createdAt", "updatedAt"],
  },

  AuthorSummary: {
    type: "object",

    properties: {
      username: {
        type: "string",
        example: "JavedanCode",
      },
    },

    required: ["username"],
  },

  Pagination: {
    type: "object",

    properties: {
      page: {
        type: "integer",
        minimum: 1,
        example: 1,
      },

      limit: {
        type: "integer",
        minimum: 1,
        maximum: 100,
        example: 20,
      },

      totalItems: {
        type: "integer",
        minimum: 0,
        example: 47,
      },

      totalPages: {
        type: "integer",
        minimum: 0,
        example: 3,
      },

      hasNextPage: {
        type: "boolean",
        example: true,
      },

      hasPreviousPage: {
        type: "boolean",
        example: false,
      },
    },

    required: [
      "page",
      "limit",
      "totalItems",
      "totalPages",
      "hasNextPage",
      "hasPreviousPage",
    ],
  },

  Error: {
    type: "object",

    properties: {
      error: {
        type: "object",

        properties: {
          code: {
            type: "string",
            example: "POST_NOT_FOUND",
          },

          message: {
            type: "string",
            example: "Post not found.",
          },
        },

        required: ["code", "message"],
      },
    },

    required: ["error"],
  },

  ValidationError: {
    type: "object",

    properties: {
      error: {
        type: "object",

        properties: {
          code: {
            type: "string",
            example: "VALIDATION_ERROR",
          },

          message: {
            type: "string",
            example: "Request validation failed.",
          },

          details: {
            type: "array",

            items: {
              type: "object",

              properties: {
                field: {
                  type: "string",
                  example: "email",
                },

                location: {
                  type: "string",
                  example: "body",
                },

                message: {
                  type: "string",
                  example: "A valid email address is required.",
                },
              },

              required: ["field", "location", "message"],
            },
          },
        },

        required: ["code", "message"],
      },
    },

    required: ["error"],
  },
};
