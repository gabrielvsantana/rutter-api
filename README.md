# Mini Rutter API

<div style="text-align: center;">
  <img src="https://i.imgur.com/4FO1XNl.png" style="width: 420px; max-width: 100%; height: auto; align: center">
</div>

## Table of Contents

1. [Requirements](#requirements)
1. [Tech Stack](#tech-stack)
1. [How to Run the Project](#how-to-run-the-project)
1. [Folder Structure](#folder-structure)
1. [Commit Strategy](#commit-strategy)
1. [Swagger](#swagger)
1. [Postman Collection](#postman-collection)
1. [Contributors](#contributors)

## Requirements
- Node.js v18.
- Docker Engine and Docker Compose Plugin.

## Tech Stack

The project was built using the following technologies:

- NestJS
- Express
- TypeORM
- PostgreSQL

## How to Run the Project

### 1. Get a Shopify Store and an API key

Before running the project, make sure you have a Shopify Store and an API key.

```
curl -X GET "https://<shopify-store>.myshopify.com/admin/api/2022-04/orders/count.json?status=any" \
-H "X-Shopify-Access-Token: <Shopify-API-key>"
```

Fill in the `<variable>` spaces, and run it in the terminal to check if they work.

### 2. Create a PostgreSQL container

Run this command in the project's root directory:

```
docker compose up -d
```

### 3. Fill .env file

You can find a `.env.example` to guide yourself.

### 4. Run these commands

1. `npm i` - Install dependencies.

1. `npm run migration:run` - Execute the DB migrations.

1. `npm run start:dev` - Start the development server

### 5. Your application is ready

The API will now be running on `http://localhost:8080` if you didn't specify a different `PORT`. You can now check it by typing this to the terminal:

```
curl -X GET 'http://localhost:8080/health'
```

#### Using CURL

1. `curl -X POST 'http://localhost:8080/products'` - Fetch products

1. `curl -X POST 'http://localhost:8080/orders'` - Fetch orders

1. `curl -X GET 'http://localhost:8080/products'` - Get products

1. `curl -X GET 'http://localhost:8080/orders'` - Get orders

## Folder Structure

The project follows the "pack by feature" folder structure and is organized as follows:

- `src/` - Application core.
  - `config/` - General configuration.
  - `migrations/` - Database schema changes.
  - `modules/` - NestJS modules. It holds the entity and everything around it.
    - `dto/` - Contracts for requests and responses.
    - `tests/` - Unit tests for the module.
    - `.entity.ts` - Class that will map to the database table.
    - `.controller.ts` - API public routes and HTTP handlers.
    - `.module.ts` - Metadata for NestJS.
    - `.repository.ts` - Encapsulate data mapping using repository pattern.
    - `.service.ts` - Business rules and use cases.
    - `.types.ts` - Shared interfaces and type aliases.
  - `services/` - Shared services between modules.
- `tests/` - Integration and E2E tests.

## Commit strategy

Heavily inspired by: [Conventional Commits](https://www.conventionalcommits.org/).

## Swagger

The project includes Swagger documentation. You can access it by running the server and opening the following URL in your browser:

```
http://localhost:8080/docs
```

## Postman Collection

If you prefer Postman, though, [here's the alternative](https://documenter.getpostman.com/view/27531077/2s93m1b4sa).

## Code Coverage

I would use Coveralls, but it's paid for private repositories. :P

<div style="text-align: center;">
  <img src="https://i.imgur.com/bjJdCJ3_d.webp?maxwidth=1520&fidelity=grand" style="width: 600px; max-width: 100%; height: auto; align: center">
</div>

## Contributors

<div style="text-align: center;">
  <img src="https://i.imgur.com/Mb0cnYf.png" style="width: 420px; max-width: 100%; height: auto; align: center">
</div>