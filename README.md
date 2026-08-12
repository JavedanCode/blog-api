# Blog API

A production-ready RESTful Blog API built with Node.js, Express, Prisma, and PostgreSQL.

The project is designed to be **cloned, customized, and reused** as a starting point for blog-based applications. It provides the backend infrastructure needed for authentication, authorization, posts, comments, OAuth, and API documentation without requiring a frontend to use it.

To demonstrate how the API can be consumed in a real application, the repository also includes a complete React frontend.

---

## Overview

This repository contains two separate applications:

- **Backend** — A reusable RESTful Blog API
- **Frontend** — A React application demonstrating one possible implementation of the API

The backend is the main project. The frontend exists as a practical example of how a client application can communicate with and build on top of the API.

The two applications are intentionally separated, allowing the API to be used independently with a different frontend, mobile application, or other client.

---

## What You Can Build With It

The API can serve as a foundation for applications such as:

- Personal blogs
- Community blogging platforms
- Content management systems
- Portfolio websites
- News or publishing platforms
- Educational content platforms
- Custom content management tools

Because the backend exposes a REST API, the client does not need to use React. You can build your own frontend with any framework or technology that can communicate with HTTP APIs.

---

## Features

The API currently supports:

- User registration and login
- JWT authentication
- Google OAuth
- GitHub OAuth
- OAuth authorization-code exchange
- Role-based authorization
- Admin users
- Blog post creation and management
- Draft and published posts
- Post publishing and unpublishing
- Comments
- Comment ownership rules
- Pagination and sorting
- Request validation
- Rate limiting
- CORS configuration
- Centralized error handling
- API response serialization
- PostgreSQL database integration
- Prisma ORM
- OpenAPI documentation
- Swagger UI
- Automated tests

---

## Repository Structure

```text
blog-api/
│
├── server/
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── client/
│   ├── src/
│   ├── package.json
│   └── README.md
│
└── README.md
```

The `server` and `client` applications have their own dependencies, configuration, development workflow, and documentation.

---

## Backend

The backend is a reusable RESTful API built with:

- Node.js
- Express
- Prisma
- PostgreSQL
- Passport.js
- JWT
- OpenAPI

It handles authentication, authorization, database operations, posts, comments, validation, security, and API documentation.

### Backend Documentation

For installation instructions, environment variables, database setup, API endpoints, authentication, OAuth, security, testing, and deployment:

**[Read the Backend README](./server/README.md)**

### Production API

```text
https://blog-api-8sy1.onrender.com
```

### API Documentation

```text
https://blog-api-8sy1.onrender.com/api/docs
```

---

## Frontend Demo

The repository also includes a React frontend demonstrating one possible use of the API.

The frontend provides:

- User authentication
- Google and GitHub login
- Blog post browsing
- Individual post pages
- Comments
- User profiles
- Admin dashboard
- Post creation
- Post editing
- Publishing controls
- Dark mode
- Responsive interface

The frontend is intentionally treated as a **demonstration client**, rather than being tightly coupled to the API itself.

### Frontend Documentation

For information about the React application, development setup, environment variables, and deployment:

**[Read the Frontend README](./client/README.md)**

### Live Demo

```text
https://javedancode.github.io/blog-api/
```

---

## How It Fits Together

At a high level, the project works like this:

```text
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │                     │
                    │   GitHub Pages      │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │     Blog API        │
                    │                     │
                    │ Node.js + Express   │
                    └──────────┬──────────┘
                               │
                               │ Prisma
                               ▼
                    ┌─────────────────────┐
                    │    PostgreSQL       │
                    │                     │
                    │       Neon          │
                    └─────────────────────┘
```

The frontend communicates with the backend exclusively through the API.

This means the frontend can be replaced without changing the core API.

---

## Using the API With Your Own Frontend

You do not need to use the included React application.

The intended workflow is:

```text
Clone the repository
        ↓
Configure the backend
        ↓
Connect your PostgreSQL database
        ↓
Run the API
        ↓
Build your own client
        ↓
Consume the REST endpoints
```

You can use the API with:

- React
- Vue
- Angular
- Svelte
- Next.js
- Mobile applications
- Server-rendered applications
- Any other HTTP client

The included React application simply demonstrates one way of consuming the API.

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/JavedanCode/blog-api.git
```

Enter the project:

```bash
cd blog-api
```

From there, choose the application you want to work with.

### Backend

```bash
cd server
npm install
npm run dev
```

The backend README contains the complete setup process, including database configuration and environment variables.

### Frontend

```bash
cd client
npm install
npm run dev
```

The frontend README contains the complete React setup and configuration instructions.

---

## Project Philosophy

The main goal of this project is to provide a **practical, reusable Blog API** rather than a frontend-specific application.

The backend is designed so that someone can:

1. Clone the repository.
2. Configure their own database and authentication providers.
3. Customize the API to their requirements.
4. Connect their own frontend or client application.
5. Use the included React application as a reference implementation if needed.

The frontend demonstrates what can be built with the API, while the API itself remains independently useful.

---

## Technology

### Backend

- Node.js
- Express
- Prisma
- PostgreSQL
- Passport.js
- JWT
- bcrypt
- express-validator
- Swagger / OpenAPI

### Frontend

- React
- React Router
- Vite
- Tailwind CSS
- Lucide React

---

## Documentation

| Application    | Documentation                         |
| -------------- | ------------------------------------- |
| Backend API    | [Backend README](./server/README.md)  |
| React Frontend | [Frontend README](./client/README.md) |

---

## Live Project

### React Demo

[https://javedancode.github.io/blog-api/](https://javedancode.github.io/blog-api/)

### Production API

[https://blog-api-8sy1.onrender.com](https://blog-api-8sy1.onrender.com)

### Swagger Documentation

[https://blog-api-8sy1.onrender.com/api/docs](https://blog-api-8sy1.onrender.com/api/docs)

---

## Project Status

The current implementation includes a complete backend API and a working React demonstration client.

The API and frontend are both deployed and can be explored using the links above.

---

## License

This project is currently developed as a personal learning and portfolio project.

If you use this project as a starting point for your own application, you are encouraged to customize the API, database schema, authentication providers, and frontend according to your requirements.
