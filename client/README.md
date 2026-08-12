# JavedanBlog — Frontend

A responsive blog frontend built with React, Vite, and Tailwind CSS. The application provides a clean, content-focused interface for reading blog posts, participating in discussions, and managing authenticated user sessions.

## Live Demo

[https://javedancode.github.io/blog-api/](https://javedancode.github.io/blog-api/)

## Screenshots

### Login

![Login Page](./screenshots/login.png)

### Home

![Home Page](./screenshots/home.png)

## Features

- Browse published blog posts
- Read individual blog posts
- Preview posts directly from the home page
- Create, edit, and delete comments
- User authentication
- Google OAuth login
- GitHub OAuth login
- User profile page
- Admin dashboard
- Create and edit blog posts
- Publish and unpublish posts
- Delete posts
- Light and dark theme
- Responsive navigation and layouts
- Client-side routing
- Loading and error states
- Reusable UI components

## Tech Stack

- **React** — UI library
- **Vite** — Development server and build tool
- **React Router** — Client-side routing
- **Tailwind CSS** — Styling and responsive design
- **Lucide React** — Interface icons

## Application Pages

### Home

The home page provides a simple article-oriented view of published posts.

Each post includes:

- Title
- Author
- Publication date
- Content preview
- Comment count
- Link to the full article

The layout is intentionally focused on readability rather than using a traditional card-based blog layout.

### Post

The post page displays the complete article along with its comments.

Authenticated users can participate in the discussion by submitting comments.

### Authentication

The frontend provides dedicated login and registration pages.

Users can authenticate with:

- Username or email and password
- Google
- GitHub

After successful authentication, the application maintains the user's session and provides access to protected routes.

### Profile

The profile page displays the currently authenticated user's account information, including:

- Username
- Email
- Account role
- Membership date

Profile information is currently read-only.

### Admin

Administrators have access to a dedicated section for managing blog content.

The admin interface includes:

- Dashboard
- Post management
- Create post
- Edit post
- Publication controls
- Delete post

## Comments

Authenticated users can create comments on blog posts.

Comments support:

- Creation
- Editing
- Deletion
- Character counting
- Loading states
- Error handling

Users can modify their own comments, while administrators can manage comments across the application.

## Theme

The application supports both light and dark themes.

The theme is handled through a dedicated React context and is applied consistently across the application's pages and reusable components.

## Responsive Design

The interface is designed to work across desktop, tablet, and mobile screen sizes.

Responsive behavior includes:

- Mobile navigation
- Flexible article layouts
- Responsive forms
- Adaptive admin interfaces
- Responsive spacing and typography

## Environment Variables

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:3000
```

For the production deployment, the frontend points to the deployed API:

```env
VITE_API_URL=https://blog-api-8sy1.onrender.com
```

`VITE_API_URL` is used by the frontend to determine the API endpoint for authentication, posts, comments, and other requests.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/JavedanCode/blog-api.git
```

Navigate to the frontend:

```bash
cd blog-api/client
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
touch .env
```

Add:

```env
VITE_API_URL=http://localhost:3000
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## Available Scripts

### Development

```bash
npm run dev
```

Starts the Vite development server.

### Production Build

```bash
npm run build
```

Creates an optimized production build.

### Preview

```bash
npm run preview
```

Serves the production build locally for testing.

### Lint

```bash
npm run lint
```

Runs ESLint against the project.

## Deployment

The frontend is deployed to GitHub Pages using GitHub Actions.

The application uses the repository name as its Vite base path:

```js
base: "/blog-api/";
```

The production application is therefore served from:

```text
https://javedancode.github.io/blog-api/
```

The deployment workflow also includes support for client-side routing so that React Router routes continue to work correctly when accessed directly.

## Author

**JavedanCode**

[GitHub](https://github.com/JavedanCode)

## License

This project is intended for educational and portfolio purposes.
