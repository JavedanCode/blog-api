export const commentSchemas = {
  Comment: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "4a6d8a0f-7f43-4f85-9d3b-123456789abc",
      },

      content: {
        type: "string",
        maxLength: 5000,
        example: "Great post! I really enjoyed reading this.",
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },

      updatedAt: {
        type: "string",
        format: "date-time",
      },

      author: {
        $ref: "#/components/schemas/AuthorSummary",
      },
    },

    required: ["id", "content", "createdAt", "updatedAt", "author"],
  },

  CreateCommentRequest: {
    type: "object",

    properties: {
      content: {
        type: "string",
        minLength: 1,
        maxLength: 5000,
        example: "Great post! I really enjoyed reading this.",
      },
    },

    required: ["content"],

    additionalProperties: false,
  },

  UpdateCommentRequest: {
    type: "object",

    properties: {
      content: {
        type: "string",
        minLength: 1,
        maxLength: 5000,
        example: "Updated comment.",
      },
    },

    required: ["content"],

    additionalProperties: false,
  },
};
