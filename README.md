# Backend (Nestjs + TS + TypeOrm + Postgresql + Kafka)

## Table of Contents
- [Project Overview](#project-overview)
- [Project Setup On Local](#project-setup-on-local)
- [Backend Structure](#backend-structure)
  - [Folder Description](#folder-description)
- [API Endpoints Documentation](#api-endpoints-documentation)
  - [Auth Routes](#auth-routes)
  - [Users Routes](#users-routes)
  - [Posts Routes](#posts-routes)
  - [Comments Routes](#comments-routes)

## Project Overview

This project is a robust backend API designed to manage posts, comments, and user authentication, along with efficient caching and a highly resilient architecture.I have also implemented realtime Notification system using **Socket.io** and **Kafka** for new, update or delete post and new comment. Below is an outline of the key technologies and features implemented in this project:

## Key Technologies Used

- **Node.js**: The runtime environment on which the backend is built.
- **Nest.js**: Used to handle HTTP requests and routing.
- **PostgreSQL**: The structured relational database used for storing posts and user data, with TypeORM.
- **Redis**: Provides caching for posts & users.
- **Type ORM**: A type-safe ORM for managing PostgreSQL database interactions.
- **JWT**: Used for user authentication via access tokens.
- **Passport**: Used as a middlewre for authentication with jwt.
- **Throttler**: Used for rate limiting the routes.
- **Socket.io**: Enables real-time, bidirectional communication between the server and clients for instant notifications.
- **kafka**: Acts as a message broker to ensure scalable and reliable event streaming, which then triggers real-time updates via Socket.io.


## Features and Functionality

### 1. **Caching with Redis**
   - Posts are cached using Redis, with pagination handled via the Redis cache keys, and cache invalidation is done on post creation or updates.

### 2. **Real-time Notifications with Kafka and Socket.io**
   - Contains Kafka Producer and Consumer logic to handle real-time events.
   - Whenever a post is created, updated, deleted, or a comment is added to a post, the Kafka Producer sends a message payload to a specific topic.
   - The Kafka Consumer listens to this topic, processes the event, and forwards a real-time notification to the post owner via Socket.io.

### 3. **Pagination and Post Management**
   - Posts are retrieved with pagination support, and Redis cache is used for faster retrieval. The `id` field in posts is used for caching, ensuring efficient access.

### 4. **Authentication and Security**
   - The API uses **NestJS Guards** in combination with **Passport** and **JWT** for secure and modular authentication.
   - Access tokens are generated using JWT and are required for accessing protected routes.
   - **Role-Based Access Control (RBAC)** is implemented using custom decorators and guards to restrict routes based on user roles (e.g., admin, user).
   - **Rate Limiting** is enforced globally using **NestJS's @nestjs/throttler** module to prevent abuse and brute-force attacks and for auth routes stricter rate limit is applied.
   - Custom exception filters provide standardized error responses for common cases like unauthorized access, invalid credentials, and resource not found.

### 5. **Database Management**
   - **PostgreSQL** is used for structured data storage, especially for posts and user-related data. TypeORM is utilized to manage database queries in a type-safe manner.

### 6. **Retry Mechanism**
   - The application has a resilient architecture with retry mechanisms for Redis and PostgreSQL connections to ensure high availability and fault tolerance.

### 7. **Clean Coding Practices**
   - The project follows clean code principles with a structured folder architecture to enhance maintainability.

### 8. **API Documentation with Swagger**
   - The project includes Swagger integration for API testing and documentation. Once the application is running, you can access Swagger at:

    - `http://localhost:3000/swagger`                             - Local Endpoint for swagger
    - `https://cloudsek-assignment.onrender.com/swagger`          - Deployed Endpoint for swagger


## Project Setup On Local
This project is a NestJS-based application that uses:

- **PostgreSQL** for database
- **Redis** for caching
- **Kafka** for message brokering
- **Docker Compose** for container orchestration

---

## Prerequisites
Make sure you have the following installed:

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/MdMassum/cloudsek_assignment.git 
cd  cloudsek_assignment
```

### 2. Create .env File
Create a .env file in the root directory and paste the following content:

```plaintext

PORT=3000
DB_PORT=5432
JWT_SECRET=<YOUR_SECRET_KEY>
KAFKA_BROKER=kafka:9092
DATABASE_URL=postgres://postgres:postgres@postgres:5432/myappdb
REDIS_URL=redis://redis-stack:6379

```

### 3. Run with Docker Compose
Build and run the app in detached mode:

docker-compose up -d --build

This will start the following services:
  - nestjs-app: Your NestJS backend running on port 3000
  - postgres: PostgreSQL running on port 5432
  - redis: Redis running on port 6379
  - kafka: Kafka broker running on port 9092
  - zookeeper: Required by Kafka, running on port 2181


### 4. Access the App
Once the containers are up:

 - Your NestJS app will be accessible at http://localhost:3000


### 5. Stop the App
To stop the containers:

  - docker-compose down


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
    │   ├── kafka.config.ts
    │   ├── socket.config.ts
    │   ├── swagger.config.ts
    │   └── typeorm.config.ts
    ├── kafka
    │   ├── kafka-consumer.service.ts
    │   ├── kafka-producer.service.ts
    │   └── kafka.module.ts
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
├── env
    ├── example.env
├── test
    ├── app.e2e-spec.ts
    └── jest-e2e.json
├── .dockerignore
├── .gitignore
├── .prettierrc
├── .docker-compose.yml
├── .dockerfile
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
- `swagger.config.ts`: Swagger (OpenAPI) configuration for API documentation.
- `kafka.config.ts`  : Configuration for Kafka.
- `socket.config.ts` : Socket.io Configuration.
- `data-source.ts`   : Configuration for datasource.

---

#### 1.5 **`kafka/`**  
Contains Kafka Producer and Consumer related logic.Whenever a post is created, updated, deleted or comment is added to post Producer sends message payload to consumer and the consumer further sends the notification to owner via socket.io.

- `karka-consumer.service.ts`: Handles subscribing to Kafka topics and processing incoming messages from the broker.
- `kafka-producer.service.ts`: Publishes messages to Kafka topics, typically triggered by post or comment creation / update events.
- `kafka.module.ts`: Responsible for setting up and providing Kafka services (producer & consumer) within the NestJS module system.

---

#### 1.6 **`posts/`**  
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

#### 1.7 **`redis/`**  
Encapsulates Redis configuration and utilities for caching or rate-limiting.

- `redis.module.ts`: Provides Redis client across the app.
- `redis.service.ts`: Configuration & Methods for interacting with Redis (e.g., set, get, delete).

---

#### 1.8 **`users/`**  
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

#### 1.9 **`app.module.ts`**  
The root module that imports all feature modules and sets up global configuration like throttling, caching, etc.

---

#### 1.10 **`main.ts`**  
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
- **`docker-compose.yml`** – Defines and orchestrates multi-container Docker services including NestJS, PostgreSQL, Redis, Kafka, and Zookeeper.
- **`dockerfile`** –  Contains instructions to build the Docker image for the NestJS backend application.

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