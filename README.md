## Description
Simple Bookmark API with Users and Bookmark endpoint

Written in NestJS with JWT authentication using Passport.

Database is Postgres and ORM is Prisma.

Includes, Auth, Bookmark, Prisma, User modules

For env variable, used Config Module from nest

DTOs are validated using Class Validators and Validation Pipe in root with useGlobalPipes.

## Auth

- Custom Decorators
- Data transfer object (DTO) pattern
- Auth Guard and Stretagy setup

## Bookmark

- DTO
- Full CRUD Endpoints

## Prisma

- Global Module
- Setting up Prisma Client

## User

- DTO
- Sign In
- Token Generation flow