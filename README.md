# Backend (Nestjs + TS + TypeOrm + Postgresql)

## Table of Contents
- [Project Overview](#project-overview)
- [Backend Structure](#backend-structure)
  - [Folder Description](#folder-description)
- [API Endpoints Documentation](#api-endpoints-documentation)
  - [Auth Routes](#auth-routes)
  - [Users Routes](#users-routes)
  - [Posts Routes](#posts-routes)
  - [Comments Routes](#comments-routes)

## Project Overview

This project is a robust backend API designed to manage posts, comments, and user authentication, along with efficient caching and a highly resilient architecture. Below is an outline of the key technologies and features implemented in this project:

## Key Technologies Used

- **Node.js**: The runtime environment on which the backend is built.
- **Nest.js**: Used to handle HTTP requests and routing.
- **PostgreSQL**: The structured relational database used for storing posts and user data, with TypeORM.
- **Redis**: Provides caching for posts & users.
- **Type ORM**: A type-safe ORM for managing PostgreSQL database interactions.
- **JWT**: Used for user authentication via access tokens.
- **Passport**: Used as a middlewre for authentication with jwt.
- **Throttler**: Used for rate limiting the routes.


## Features and Functionality

### 1. **Caching with Redis**
   - Posts are cached using Redis, with pagination handled via the Redis cache keys, and cache invalidation is done on post creation or updates.

### 2. **Pagination and Post Management**
   - Posts are retrieved with pagination support, and Redis cache is used for faster retrieval. The `id` field in posts is used for caching, ensuring efficient access.

### 3. **Authentication and Security**
   - The API uses **NestJS Guards** in combination with **Passport** and **JWT** for secure and modular authentication.
   - Access tokens are generated using JWT and are required for accessing protected routes.
   - **Role-Based Access Control (RBAC)** is implemented using custom decorators and guards to restrict routes based on user roles (e.g., admin, user).
   - **Rate Limiting** is enforced globally using **NestJS's @nestjs/throttler** module to prevent abuse and brute-force attacks and for auth routes stricter rate limit is applied.
   - Custom exception filters provide standardized error responses for common cases like unauthorized access, invalid credentials, and resource not found.

### 4. **Database Management**
   - **PostgreSQL** is used for structured data storage, especially for posts and user-related data. TypeORM is utilized to manage database queries in a type-safe manner.

### 5. **Retry Mechanism**
   - The application has a resilient architecture with retry mechanisms for Redis and PostgreSQL connections to ensure high availability and fault tolerance.

### 6. **Clean Coding Practices**
   - The project follows clean code principles with a structured folder architecture to enhance maintainability.

### 7. **API Documentation with Swagger**
   - The project includes Swagger integration for API testing and documentation. Once the application is running, you can access Swagger at:

    `http://localhost:3000/swagger`                             - Local Endpoint for swagger
    `https://cloudsek-assignment.onrender.com/swagger`          - Deployed Endpoint for swagger


## APIs Overview

The API supports CRUD operations for **posts**, **comments**, and **user authentication**, with capabilities like creating posts, adding comments, managing replies, and authenticating users. The API ensures seamless user experience with features such as:

- **User Authentication**: Register, login, logout.
- **Posts Management**: Create, retrieve, update, and delete posts, with caching and pagination.
- **Comments Management**: Create, update, and delete comments or replies on posts.
- **Error Handling**: Structured error responses with appropriate HTTP status codes for common errors like authentication failure and resource not found.


## Backend Structure

Below is the folder structure of the project:

```plaintext

├── src
    ├── auth
    │   ├── auth.controller.ts
    │   ├── auth.module.ts
    │   ├── auth.service.ts
    │   ├── dto
    │   │   ├── login.dto.ts
    │   │   └── signup.dto.ts
    │   ├── guards
    │   │   ├── jwt-auth.guard.ts
    │   │   └── local-auth.guard.ts
    │   ├── jwt.strategy.ts
    │   └── local.strategy.ts
    ├── comments
    │   ├── comment.controller.ts
    │   ├── comments.module.ts
    │   ├── comments.service.ts
    │   ├── dto
    │   │   ├── create-comment.dto.ts
    │   │   └── update-comment.dto.ts
    │   └── entities
    │   │   └── comment.entity.ts
    ├── common
    │   ├── decorators
    │   │   ├── role.decorator.ts
    │   │   └── user.decorator.ts
    │   ├── guards
    │   │   ├── jwt-auth.guard.ts
    │   │   └── role.guard.ts
    │   └── interfaces
    │   │   └── pagination.interface.ts
    ├── config
    │   ├── data-source.ts
    │   ├── swagger.ts
    │   └── typeorm.config.ts
    ├── posts
    │   ├── dto
    │   │   ├── create-post.dto.ts
    │   │   └── update-post.dto.ts
    │   ├── entities
    │   │   └── post.entity.ts
    │   ├── posts.controller.ts
    │   ├── posts.module.ts
    │   └── posts.service.ts
    ├── redis
    │   ├── redis.module.ts
    │   └── redis.service.ts
    └── users
    │   ├── dto
    │       ├── create-user.dto.ts
    │       ├── update-role.dto.ts
    │       └── update-user.dto.ts
    │   ├── entities
    │       └── user.entity.ts
    │   ├── users.controller.ts
    │   ├── users.module.ts
    │   └── users.service.ts
    ├── app.module.ts
    ├── main.ts
├── test
    ├── app.e2e-spec.ts
    └── jest-e2e.json
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
```

## Folder Description
Below is the folder structure of the backend NestJS application. The source code is organized in a modular way to promote scalability, maintainability, and readability.

---

### 1. **`src/`**  
The main source directory where all the core application logic is defined, following NestJS’s modular structure. It includes modules for features like authentication, posts, comments, and users, as well as shared configuration, guards, and decorators.

---

#### 1.1 **`auth/`**  
Handles all authentication and authorization functionalities using NestJS guards, strategies, and Passport.

- `auth.controller.ts`: Defines routes for login and signup.
- `auth.module.ts`: Wraps all authentication-related providers and controllers.
- `auth.service.ts`: Contains the core logic for validating users and issuing tokens.
- `dto/`: DTOs for login and signup requests.
  - `login.dto.ts`: Data Transfer Object for user login.
  - `signup.dto.ts`: Data Transfer Object for user registration.
- `guards/`: Custom guards using Passport strategies.
  - `jwt-auth.guard.ts`: Guard to protect routes using JWT.
  - `local-auth.guard.ts`: Guard to handle local authentication (username/password).
- `jwt.strategy.ts`: Strategy to handle JWT validation logic.
- `local.strategy.ts`: Strategy for local authentication logic.

---

#### 1.2 **`comments/`**  
Manages CRUD operations for comments.

- `comment.controller.ts`: Handles HTTP endpoints for creating and managing comments.
- `comments.module.ts`: Module wrapper for the comments feature.
- `comments.service.ts`: Business logic for comments.
- `dto/`: DTOs for comment operations.
  - `create-comment.dto.ts`: Defines the shape of data required to create a comment.
  - `update-comment.dto.ts`: Defines the shape for updating a comment.
- `entities/`: TypeORM entities for comments.
  - `comment.entity.ts`: Defines the Comment entity schema.

---

#### 1.3 **`common/`**  
Holds shared logic, decorators, and guards used across modules.

- `decorators/`: Custom decorators.
  - `role.decorator.ts`: Extracts role metadata for access control.
  - `user.decorator.ts`: Extracts user info from request object.
- `guards/`: Global or shared guards.
  - `jwt-auth.guard.ts`: (alternative or extended guard used globally).
  - `role.guard.ts`: Role-based access guard.
- `interfaces/`: Shared interfaces across the app.
  - `pagination.interface.ts`: Defines structure for pagination parameters and response.

---

#### 1.4 **`config/`**  
Centralized configuration files.

- `typeorm.config.ts`: Configures and initializes the database connection with TypeORM.
- `swagger.ts`: Swagger (OpenAPI) configuration for API documentation.
- `data-source.ts`: Configuration for datasource.

---

#### 1.5 **`posts/`**  
Handles post creation, update, deletion, and retrieval.

- `posts.controller.ts`: Routes related to posts.
- `posts.module.ts`: Feature module for posts.
- `posts.service.ts`: Business logic for interacting with the post entity.
- `dto/`: DTOs for creating/updating posts.
  - `create-post.dto.ts`: Payload format for creating posts.
  - `update-post.dto.ts`: Payload format for updating posts.
- `entities/`: Post entity for TypeORM.
  - `post.entity.ts`: Defines Post schema.

---

#### 1.6 **`redis/`**  
Encapsulates Redis configuration and utilities for caching or rate-limiting.

- `redis.module.ts`: Provides Redis client across the app.
- `redis.service.ts`: Configuration & Methods for interacting with Redis (e.g., set, get, delete).

---

#### 1.7 **`users/`**  
Manages user, profile updates, and role assignment.

- `users.controller.ts`: Handles endpoints for user operations.
- `users.module.ts`: NestJS module for the user feature.
- `users.service.ts`: Business logic for users.
- `dto/`: DTOs for user-related operations.
  - `create-user.dto.ts`: Data for creating a new user.
  - `update-user.dto.ts`: Data for updating user info.
  - `update-role.dto.ts`: Payload for updating user roles.
- `entities/`: User entity for TypeORM.
  - `user.entity.ts`: Defines the User table schema.

---

#### 1.8 **`app.module.ts`**  
The root module that imports all feature modules and sets up global configuration like throttling, caching, etc.

---

#### 1.9 **`main.ts`**  
The entry point of the application that bootstraps the NestJS app and applies global middlewares, pipes, and configurations.

---

### 2. **`test/`**  
Contains end-to-end (e2e) tests and related configurations.

- `app.e2e-spec.ts`: E2E test cases for validating application endpoints.
- `jest-e2e.json`: Jest config specific to e2e testing.

---

### 3. **Root Files**

- **`.gitignore`** – Specifies files/folders to be ignored by Git.
- **`.prettierrc`** – Prettier configuration for code formatting.
- **`eslint.config.mjs`** – ESLint rules for maintaining consistent code style.
- **`nest-cli.json`** – NestJS CLI project configuration.
- **`package.json` / `package-lock.json`** – Project dependencies and scripts.
- **`tsconfig.json` / `tsconfig.build.json`** – TypeScript compiler configurations.
- **`README.md`** – Documentation and overview of the project.

---

## API Endpoints Documentation

`http://localhost:3000/api/v1` - for local development
`https://cloudsek-assignment.onrender.com/api/v1`  - for deployed link

### Auth Routes

Base URL: `/auth`

| Method | Endpoint           | Description                    |
|--------|--------------------|--------------------------------|
| POST   | `/signup`          | Registers a new user           |
| POST   | `/login`           | Logs in an existing user       |
| POST   | `/logout`          | Logs out the authenticated user|
| GET    | `/profile`         | Get my profile                 |
| PUT    | `/change-password` | Changes Password               |

---

### Users Routes

Base URL: `/users`  (All this routes are authenticated)

| Method | Endpoint           | Description                    |
|--------|--------------------|--------------------------------|
| GET    | `/`                | Get all users (ADMIN ROUTE)    |
| GET    | `/:id`             | Get single user by Id          |
| PATCH  | `/role/update/:id` | Update Role  (ADMIN ROUTE)     |
| DELETE | `/:id`             | Delete User By id(ADMIN ROUTE) |

---

### Posts Routes

Base URL: `/posts`   (All this routes are authenticated)

| Method | Endpoint       | Description                         |
|--------|----------------|-------------------------------------|
| GET    | `/`            | Retrieves all posts                 |
| GET    | `/:id`         | Retrieves a specific post by ID     |
| GET    | `/me`          | Retrieves my all posts              |
| POST   | `/create`      | Creates a new post                  |
| PUT    | `/:id`         | Updates an existing post by ID      |
| DELETE | `/:id`         | Deletes a post by ID                |

---

### Comments Routes

Base URL: `/comments`   (All this routes are authenticated)

| Method | Endpoint       | Description                         |
|--------|----------------|-------------------------------------|
| GET    | `/:id`         | Retrieves comment by ID             |
| POST   | `/new/:postId` | Add new comment on post             |
| PUT    | `/:id`         | Updates my comment                  |
| DELETE | `/:id`         | Deletes my comment                  |

---