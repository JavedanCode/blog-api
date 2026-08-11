export const postSchemas = {
  Post: {
    type: "object",

    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "0f321c2f-4619-4c1d-a280-e96f08e4928f",
      },

      title: {
        type: "string",
        maxLength: 200,
        example: "My First Blog Post",
      },

      content: {
        type: "string",
        maxLength: 100000,
        example: "This is the content of my first blog post.",
      },

      published: {
        type: "boolean",
        example: true,
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

      commentsCount: {
        type: "integer",
        minimum: 0,
        example: 4,
      },
    },

    required: [
      "id",
      "title",
      "content",
      "published",
      "createdAt",
      "updatedAt",
      "author",
      "commentsCount",
    ],
  },

  CreatePostRequest: {
    type: "object",

    properties: {
      title: {
        type: "string",
        minLength: 1,
        maxLength: 200,
        example: "My First Blog Post",
      },

      content: {
        type: "string",
        minLength: 1,
        maxLength: 100000,
        example: "This is the content of my first blog post.",
      },
    },

    required: ["title", "content"],

    additionalProperties: false,
  },

  UpdatePostRequest: {
    type: "object",

    properties: {
      title: {
        type: "string",
        minLength: 1,
        maxLength: 200,
        example: "Updated Blog Post",
      },

      content: {
        type: "string",
        minLength: 1,
        maxLength: 100000,
        example: "Updated content.",
      },
    },

    additionalProperties: false,

    minProperties: 1,
  },
};
