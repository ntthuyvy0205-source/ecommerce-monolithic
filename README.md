# Ecommerce Monolithic RESTful API

RESTful API cho hệ thống thương mại điện tử MVP sử dụng kiến trúc Monolithic.

## Technologies

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT
- bcryptjs
- Docker
- Docker Compose

## Database Models

- Role
- Membership
- User
- Product
- Order
- OrderDetail
- Shipment

## Features

- Register / Login
- JWT Authentication
- Password hashing with bcrypt
- Role CRUD
- Membership CRUD
- Product CRUD
- Order & OrderDetail
- Inventory transaction
- Shipment management
- Health Check
- Docker Compose

## Run with Docker

Create `.env` based on `.env.example`.

Then run:

```bash
docker compose up -d --build