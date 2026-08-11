import swaggerJSDoc from "swagger-jsdoc";

import { commonSchemas } from "./schemas/common.js";
import { authSchemas } from "./schemas/auth.js";
import { postSchemas } from "./schemas/post.js";
import { commentSchemas } from "./schemas/comment.js";

const options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Blog API",
      version: "1.0.0",
      description:
        "RESTful API for the Blog application. Provides authentication, blog post management, publishing, and comment management.",
    },

    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local development server",
      },
    ],

    tags: [
      {
        name: "Authentication",
        description:
          "Registration, login, OAuth authentication, and the current authenticated user.",
      },
      {
        name: "Posts",
        description:
          "Create, read, update, delete, publish, and unpublish blog posts.",
      },
      {
        name: "Comments",
        description: "Create, read, update, and delete comments.",
      },
    ],

    externalDocs: {
      description: "OpenAPI Specification",
      url: "https://spec.openapis.org/oas/v3.0.3",
    },

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter your JWT access token. Do not include the 'Bearer ' prefix.",
        },
      },

      schemas: {
        ...commonSchemas,
        ...authSchemas,
        ...postSchemas,
        ...commentSchemas,
      },

      responses: {
        ValidationError: {
          description: "The request contains invalid data.",
        },

        Unauthorized: {
          description:
            "Authentication is required or the provided credentials are invalid.",
        },

        Forbidden: {
          description:
            "The authenticated user does not have permission to perform this action.",
        },

        NotFound: {
          description: "The requested resource was not found.",
        },

        Conflict: {
          description: "The request conflicts with existing data.",
        },

        InternalServerError: {
          description: "An unexpected server error occurred.",
        },

        OAuthProviderError: {
          description:
            "The external OAuth provider could not complete the authentication request.",
        },
      },
    },
  },

  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
