# Blog API

A RESTful Blog API built with Node.js, Express, Prisma, and PostgreSQL.

This project provides the backend for a full-stack blog application with local authentication, Google and GitHub OAuth, JWT-based authorization, role-based access control, post publishing, comment management, validation, rate limiting, centralized error handling, automated tests, and interactive OpenAPI documentation.

The frontend is intentionally separated from the backend while remaining within the same project. The backend and frontend have their own directories, dependencies, and development scripts.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the API](#running-the-api)
- [Authentication](#authentication)
- [OAuth](#oauth)
- [Authorization](#authorization)
- [Posts API](#posts-api)
- [Comments API](#comments-api)
- [Validation](#validation)
- [Error Handling](#error-handling)
- [Security](#security)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Development Workflow](#development-workflow)
- [Frontend](#frontend)
- [Design Principles](#design-principles)
- [Future Improvements](#future-improvements)
- [Project Status](#project-status)
- [License](#license)

---

# Overview

The Blog API is the backend service for a full-stack blogging platform.

The API provides endpoints for:

- User registration and authentication
- Google OAuth authentication
- GitHub OAuth authentication
- JWT-based access control
- Role-based authorization
- Blog post creation and management
- Publishing and unpublishing posts
- Comment creation and management
- Pagination and sorting
- Request validation
- Centralized error handling
- API rate limiting
- Interactive Swagger/OpenAPI documentation

The backend follows a layered architecture designed to keep HTTP concerns, business logic, database access, authentication, and serialization separated from one another.

---

# Features

## Authentication

- Local username/email and password authentication
- JWT access tokens
- Passport.js authentication
- Passport JWT strategy
- Google OAuth 2.0
- GitHub OAuth
- Verified OAuth email handling
- Multiple authentication providers per user
- Secure password hashing with bcrypt
- Protected API routes

## Authorization

- Role-based access control
- `USER` role
- `ADMIN` role
- Admin-only post management
- Owner-based comment modification
- Administrator comment management
- Draft post protection

## Posts

- Create posts
- Read posts
- Update posts
- Delete posts
- Publish posts
- Unpublish posts
- Draft/published status
- Paginated post listing
- Sorting
- Comment counts
- Sanitized API responses

## Comments

- Create comments
- Read comments
- Update comments
- Delete comments
- Users can manage their own comments
- Administrators can manage all comments
- Comments can only be created on published posts

## API Quality

- Request validation with `express-validator`
- Strict request-field validation
- UUID validation
- Input normalization
- Centralized error handling
- Consistent application error codes
- Rate limiting
- Helmet security headers
- Configurable CORS
- HTTP request logging
- JSON request-size limits
- Explicit API serialization

## Documentation

- OpenAPI 3.0.3
- Swagger UI
- JWT authorization inside Swagger
- Reusable OpenAPI schemas
- Authentication documentation
- OAuth documentation
- Post documentation
- Comment documentation
- Standardized error responses
- Pagination documentation

---

# Tech Stack

| Technology              | Purpose                          |
| ----------------------- | -------------------------------- |
| Node.js                 | JavaScript runtime               |
| Express                 | REST API framework               |
| Prisma                  | ORM and database access          |
| PostgreSQL              | Relational database              |
| Neon                    | PostgreSQL hosting               |
| Passport.js             | Authentication middleware        |
| passport-jwt            | JWT authentication strategy      |
| passport-google-oauth20 | Google OAuth                     |
| passport-github         | GitHub OAuth                     |
| jsonwebtoken            | JWT creation and signing         |
| bcryptjs                | Password hashing                 |
| express-validator       | Request validation               |
| express-rate-limit      | Rate limiting                    |
| Helmet                  | Security headers                 |
| CORS                    | Cross-origin request handling    |
| Morgan                  | HTTP request logging             |
| Swagger JSDoc           | OpenAPI specification generation |
| Swagger UI Express      | Interactive API documentation    |
| Nodemon                 | Development server               |

---

# Architecture

The backend follows a layered architecture.

```text
                    HTTP Request
                         │
                         ▼
                   Express Server
                         │
                         ▼
                     Middleware
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       Security      Validation    Authentication
          │              │              │
          └──────────────┼──────────────┘
                         │
                         ▼
                     Controller
                         │
                         ▼
                      Service
                         │
                         ▼
                       Prisma
                         │
                         ▼
                    PostgreSQL
```

## Routes

Routes define the HTTP API and compose the middleware pipeline.

They are responsible for:

- HTTP methods
- Endpoint paths
- Authentication middleware
- Authorization middleware
- Validation middleware
- Controller selection

Routes should not contain business logic.

## Controllers

Controllers handle HTTP-specific responsibilities.

They:

- Read request data
- Call services
- Construct responses
- Forward errors

Controllers are intentionally kept thin.

## Services

Services contain application and business logic.

They are responsible for:

- Database operations
- Business rules
- Resource existence checks
- Authorization-related business rules
- Transforming database results into API-ready data

## Middleware

Middleware handles cross-cutting concerns such as:

- Authentication
- Authorization
- Validation
- Rate limiting
- Error handling
- Request processing

## Prisma

Prisma acts as the database access layer between the services and PostgreSQL.

The Prisma schema is located at:

```text
server/src/db/schema.prisma
```

## Serializers

Database records are not returned directly to API consumers.

Serializer functions explicitly control the public API representation and prevent internal fields from being accidentally exposed.

---

# Project Structure

```text
blog-api/
│
├── server/
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │   ├── env.js
│   │   │   └── passport/
│   │   │       ├── github.js
│   │   │       ├── google.js
│   │   │       ├── jwt.js
│   │   │       ├── local.js
│   │   │       └── index.js
│   │   │
│   │   ├── controllers/
│   │   │
│   │   ├── db/
│   │   │   ├── schema.prisma
│   │   │   └── seed.js
│   │   │
│   │   ├── docs/
│   │   │   ├── openapi.js
│   │   │   └── schemas/
│   │   │
│   │   ├── errors/
│   │   │
│   │   ├── lib/
│   │   │
│   │   ├── middleware/
│   │   │
│   │   ├── routes/
│   │   │
│   │   ├── services/
│   │   │
│   │   ├── utils/
│   │   │
│   │   └── app.js
│   │
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── README.md
└── ...
```

The frontend will eventually live alongside `server/` in its own directory.

For example:

```text
blog-api/
├── server/
│   └── Backend API
│
└── client/
    └── Frontend application
```

---

# Getting Started

## Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git
- A PostgreSQL database

This project currently uses PostgreSQL hosted through Neon.

---

## Clone the Repository

```bash
git clone <repository-url>
```

Move into the project:

```bash
cd blog-api
```

Then enter the backend:

```bash
cd server
```

---

## Install Dependencies

From the `server` directory:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=3000

NODE_ENV=development

DATABASE_URL=your_database_url

JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=15m
JWT_ISSUER=blog-api
JWT_AUDIENCE=blog-api-client

CORS_ORIGINS=http://localhost:5173

CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback
```

## Environment Variable Reference

| Variable               | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `PORT`                 | Port used by the Express server                 |
| `NODE_ENV`             | Application environment                         |
| `DATABASE_URL`         | PostgreSQL connection string                    |
| `JWT_SECRET`           | Secret used to sign JWTs                        |
| `JWT_EXPIRES_IN`       | JWT expiration duration                         |
| `JWT_ISSUER`           | JWT issuer                                      |
| `JWT_AUDIENCE`         | JWT audience                                    |
| `CORS_ORIGINS`         | Comma-separated list of allowed browser origins |
| `CLIENT_URL`           | Frontend application URL                        |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID                          |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret                      |
| `GOOGLE_CALLBACK_URL`  | Google OAuth callback URL                       |
| `GITHUB_CLIENT_ID`     | GitHub OAuth client ID                          |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret                      |
| `GITHUB_CALLBACK_URL`  | GitHub OAuth callback URL                       |

Never commit the real `.env` file.

The repository includes `.env.example` as a template.

---

# Database Setup

The application uses Prisma with PostgreSQL.

The Prisma schema is located at:

```text
server/src/db/schema.prisma
```

After configuring `DATABASE_URL`, run the Prisma migration command configured for the project.

For a development migration:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

If the project seed script is configured, run:

```bash
npm run seed
```

The available database and seed scripts are defined in:

```text
server/package.json
```

---

# Running the API

From the `server` directory:

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

The API runs by default at:

```text
http://localhost:3000
```

---

# Health Check

The API exposes a simple health endpoint:

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "message": "Blog API is running"
}
```

---

# Authentication

The API uses JWT Bearer authentication for protected endpoints.

After successful authentication, the API returns an access token.

Example:

```json
{
  "message": "Login successful.",
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "USER"
  },
  "accessToken": "eyJ..."
}
```

Protected requests must include:

```http
Authorization: Bearer <access-token>
```

JWTs contain the authenticated user's ID in the `sub` claim.

The JWT configuration also uses an issuer and audience to ensure tokens were issued for this application.

---

# Local Authentication

## Register

```http
POST /api/auth/register
```

Request:

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

A successful registration returns a JWT access token.

---

## Login

```http
POST /api/auth/login
```

The `identifier` can be either a username or an email address.

Request:

```json
{
  "identifier": "john_doe",
  "password": "securePassword123"
}
```

Successful authentication returns a JWT access token.

---

## Current User

```http
GET /api/auth/me
```

Authentication required.

Example:

```http
Authorization: Bearer <access-token>
```

---

# OAuth

The API supports OAuth authentication through:

- Google
- GitHub

OAuth authentication uses browser-based redirects rather than normal AJAX requests.

---

## Google

Start the Google authentication flow:

```http
GET /api/auth/google
```

The user's browser is redirected to Google.

After successful authentication, Google redirects back to:

```http
GET /api/auth/google/callback
```

---

## GitHub

Start the GitHub authentication flow:

```http
GET /api/auth/github
```

The user's browser is redirected to GitHub.

After successful authentication, GitHub redirects back to:

```http
GET /api/auth/github/callback
```

---

## OAuth Email Requirements

OAuth authentication requires a verified email address.

For GitHub, the API retrieves the user's verified email addresses and prefers the primary verified email.

For Google, the API uses a verified email returned by Google.

If no verified email is available, authentication is rejected.

---

## OAuth Account Linking

If an OAuth account uses an email address that already belongs to an existing application user, the OAuth provider account can be linked to that existing user.

This allows a user to have multiple authentication providers associated with the same application account.

---

# Authorization

The application currently defines two roles:

```text
USER
ADMIN
```

## USER

Regular users can:

- View published posts
- View comments on published posts
- Create comments
- Edit their own comments
- Delete their own comments

## ADMIN

Administrators can:

- View published posts
- View unpublished posts
- Create posts
- Update posts
- Delete posts
- Publish posts
- Unpublish posts
- Manage comments

Authorization is enforced on the API server and is not dependent on frontend behavior.

---

# Posts API

## Endpoint Overview

| Method   | Endpoint                   | Authentication | Authorization |
| -------- | -------------------------- | -------------- | ------------- |
| `GET`    | `/api/posts`               | Required       | Authenticated |
| `GET`    | `/api/posts/:id`           | Required       | Authenticated |
| `POST`   | `/api/posts`               | Required       | Admin         |
| `PUT`    | `/api/posts/:id`           | Required       | Admin         |
| `DELETE` | `/api/posts/:id`           | Required       | Admin         |
| `PATCH`  | `/api/posts/:id/publish`   | Required       | Admin         |
| `PATCH`  | `/api/posts/:id/unpublish` | Required       | Admin         |

---

## List Posts

```http
GET /api/posts
```

Authentication required.

Regular users receive published posts only.

Administrators receive both published posts and unpublished drafts.

The endpoint supports pagination and sorting.

Example:

```http
GET /api/posts?page=1&limit=20&sort=createdAt&order=desc
```

---

## Get a Post

```http
GET /api/posts/:id
```

The `id` must be a valid UUID.

Regular users can retrieve published posts.

Administrators can retrieve both published and unpublished posts.

---

## Create a Post

```http
POST /api/posts
```

Admin only.

Request:

```json
{
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post."
}
```

New posts are created as unpublished by default.

---

## Update a Post

```http
PUT /api/posts/:id
```

Admin only.

The title and content can be updated independently.

Example:

```json
{
  "title": "Updated Blog Post"
}
```

or:

```json
{
  "content": "Updated content."
}
```

---

## Delete a Post

```http
DELETE /api/posts/:id
```

Admin only.

Deleting a post also removes its associated comments through the database relationship.

---

## Publish a Post

```http
PATCH /api/posts/:id/publish
```

Admin only.

Changes the post's published status to:

```text
published = true
```

---

## Unpublish a Post

```http
PATCH /api/posts/:id/unpublish
```

Admin only.

Changes the post's published status to:

```text
published = false
```

---

# Comments API

## Endpoint Overview

| Method   | Endpoint                      | Authentication | Authorization |
| -------- | ----------------------------- | -------------- | ------------- |
| `GET`    | `/api/posts/:postId/comments` | Required       | Authenticated |
| `POST`   | `/api/posts/:postId/comments` | Required       | Authenticated |
| `PUT`    | `/api/comments/:commentId`    | Required       | Owner/Admin   |
| `DELETE` | `/api/comments/:commentId`    | Required       | Owner/Admin   |

---

## List Comments

```http
GET /api/posts/:postId/comments
```

Authentication required.

The associated post must be published.

---

## Create a Comment

```http
POST /api/posts/:postId/comments
```

Authentication required.

The post must be published.

Request:

```json
{
  "content": "Great post!"
}
```

---

## Update a Comment

```http
PUT /api/comments/:commentId
```

Authentication required.

A regular user may update only their own comment.

Administrators may update any comment.

Request:

```json
{
  "content": "Updated comment."
}
```

---

## Delete a Comment

```http
DELETE /api/comments/:commentId
```

Authentication required.

A regular user may delete only their own comment.

Administrators may delete any comment.

---

# Validation

The API validates incoming requests before they reach the application services.

Validation includes:

- Required fields
- String types
- String lengths
- Email format
- Password length
- Username format
- UUID format
- Query parameters
- Allowed request fields

Unexpected request fields are rejected where strict validation is enabled.

The API does not trust client-supplied authorization or ownership information.

Authenticated user identity comes from the verified JWT.

---

# Error Handling

The API uses centralized error handling.

Errors follow a consistent structure.

Example:

```json
{
  "error": {
    "code": "POST_NOT_FOUND",
    "message": "Post not found."
  }
}
```

Validation errors may contain additional details:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed.",
    "details": [
      {
        "field": "email",
        "location": "body",
        "message": "A valid email address is required."
      }
    ]
  }
}
```

---

## HTTP Status Codes

| Status | Meaning                                          |
| ------ | ------------------------------------------------ |
| `400`  | Invalid request or validation failure            |
| `401`  | Authentication required or authentication failed |
| `403`  | Authenticated user does not have permission      |
| `404`  | Requested resource does not exist                |
| `409`  | Request conflicts with existing data             |
| `500`  | Unexpected server error                          |
| `502`  | External OAuth provider failure                  |

---

## Common Error Codes

Examples include:

```text
VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
POST_NOT_FOUND
COMMENT_NOT_FOUND
DUPLICATE_ENTRY_ERROR
OAUTH_EMAIL_NOT_VERIFIED
OAUTH_PROVIDER_ERROR
INTERNAL_SERVER_ERROR
```

The exact error codes exposed by the API are documented in the OpenAPI specification.

---

# Security

Several security measures are implemented at the API level.

## Password Security

Passwords are never stored in plaintext.

Local account passwords are hashed using bcrypt.

Only password hashes are stored in the database.

Password hashes are never exposed through API responses.

---

## JWT Security

JWTs use:

- A secret signing key
- Issuer validation
- Audience validation
- An expiration time
- The `HS256` signing algorithm

The application also validates the configured JWT secret during startup.

---

## Authorization

Authorization is enforced server-side.

A client cannot become an administrator simply by sending:

```json
{
  "role": "ADMIN"
}
```

The user's role comes from the authenticated database record.

---

## Rate Limiting

Authentication endpoints are rate-limited to reduce brute-force attempts.

The API also applies general API rate limiting.

---

## Helmet

Helmet is used to provide common HTTP security headers.

---

## CORS

CORS is configured through environment variables.

Example:

```env
CORS_ORIGINS=http://localhost:5173
```

Multiple origins can be provided as a comma-separated list:

```env
CORS_ORIGINS=http://localhost:5173,https://example.com
```

The API does not use wildcard origins for the authenticated application.

---

## Request Limits

JSON and URL-encoded request bodies are subject to configured size limits to prevent unnecessarily large requests.

---

# API Documentation

Interactive Swagger documentation is available at:

```text
http://localhost:3000/api/docs
```

The documentation is generated using OpenAPI 3.0.3.

Swagger UI provides:

- Endpoint descriptions
- Request parameters
- Request bodies
- Response schemas
- Authentication requirements
- Error responses
- Reusable schemas
- JWT authorization
- Interactive API requests

---

## Swagger Authentication

To test protected endpoints through Swagger:

1. Register or log in using the API.
2. Copy the returned `accessToken`.
3. Open Swagger UI.
4. Click `Authorize`.
5. Paste the JWT access token.
6. Click `Authorize`.
7. Execute protected endpoints using `Try it out`.

Do not include the `Bearer` prefix when entering the token into the Swagger authorization dialog.

Swagger adds the appropriate header automatically.

---

## OAuth and Swagger

OAuth initiation endpoints are browser redirect endpoints.

They should be opened as normal browser navigations rather than executed through Swagger's AJAX-based `Try it out` functionality.

For example:

```text
http://localhost:3000/api/auth/google
```

should be opened directly in the browser.

The same applies to GitHub OAuth:

```text
http://localhost:3000/api/auth/github
```

---

# Testing

The backend includes tests covering the major application areas.

Tests cover functionality including:

- Authentication
- Authorization
- JWT validation
- Request validation
- Posts
- Comments
- Resource existence
- Ownership rules
- Error handling

Run the configured test suite using the test script defined in:

```text
server/package.json
```

For example:

```bash
npm test
```

The complete test suite should pass before deploying the API.

---

# Development Workflow

A typical development workflow is:

```text
1. Start PostgreSQL / Neon
        ↓
2. Start the API
        ↓
3. Run tests
        ↓
4. Use Swagger/Postman for API testing
        ↓
5. Make changes
        ↓
6. Run tests again
```

For API development, Swagger is available at:

```text
http://localhost:3000/api/docs
```

---

# Frontend

The backend is intentionally separated from the frontend.

The planned project structure is:

```text
blog-api/
│
├── server/
│   └── REST API
│
└── client/
    └── Frontend application
```

The frontend will have its own:

- `package.json`
- Dependencies
- Scripts
- Source code
- Build configuration

The frontend communicates with the backend through the REST API.

This keeps the two applications independently maintainable while allowing them to remain part of the same repository.

---

# Design Principles

The backend follows several principles throughout the implementation.

## Separation of Concerns

Each layer has a specific responsibility.

## Thin Controllers

Controllers handle HTTP concerns rather than business logic.

## Service-Based Business Logic

Business rules and database operations live in services.

## Explicit Serialization

Database objects are never blindly exposed to API consumers.

## Server-Side Authorization

Permissions are determined by the authenticated server-side user rather than client-supplied data.

## Validate Early

Invalid requests are rejected before reaching business logic.

## Consistent Errors

Application errors use predictable HTTP status codes and machine-readable error codes.

## Configuration Through Environment Variables

Environment-specific values are not hardcoded into application logic.

## Documentation as Part of the API

The OpenAPI specification documents the API contract and is maintained alongside the implementation.

---

# Future Improvements

Potential future improvements include:

- Refresh token support
- More advanced session management
- Email verification for local accounts
- Password reset functionality
- Account deletion
- Rich text editing
- Image and file uploads
- Post categories
- Post tags
- Search
- Advanced filtering
- Comment pagination
- Comment moderation
- API client generation
- CI/CD
- Production deployment
- Monitoring and observability
- Frontend application

These features are intentionally outside the current backend scope.

---

# Project Status

## Backend

**Complete and documented.**

Current backend functionality includes:

- RESTful API
- PostgreSQL database
- Prisma ORM
- Local authentication
- Google OAuth
- GitHub OAuth
- JWT authentication
- Role-based authorization
- Blog post management
- Draft/published workflow
- Comment management
- Request validation
- Rate limiting
- Security middleware
- Centralized error handling
- API serialization
- Automated tests
- OpenAPI documentation
- Swagger UI

## Frontend

The frontend is the next major stage of development and will be implemented as a separate application within this repository.

---

# License

This project is currently developed as a personal learning and portfolio project.

Add a formal license here if the project is later released under a specific open-source license.
