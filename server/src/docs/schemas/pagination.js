export const paginationSchemas = {
  PaginatedPostsResponse: {
    type: "object",

    properties: {
      posts: {
        type: "array",

        items: {
          $ref: "#/components/schemas/Post",
        },
      },

      pagination: {
        $ref: "#/components/schemas/Pagination",
      },
    },

    required: ["posts", "pagination"],
  },

  PaginatedCommentsResponse: {
    type: "object",

    properties: {
      comments: {
        type: "array",

        items: {
          $ref: "#/components/schemas/Comment",
        },
      },

      pagination: {
        $ref: "#/components/schemas/Pagination",
      },
    },

    required: ["comments", "pagination"],
  },
};
