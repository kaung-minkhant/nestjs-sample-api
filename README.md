## To Run
Docker is used to run database, so install docker with compose plugin
- `npm run db:dev:start` to start database
- `npm run prisma:dev:deploy` to apply migrations to the database
- `npm run start:dev` to run the server with watch mode.


## Description
Simple Bookmark API with Users and Bookmark endpoints

Written in NestJS with JWT authentication using Passport.

Database is Postgres and ORM is Prisma.

Includes, Auth, Bookmark, Prisma, User modules

For env variable, used Config Module from nest

DTOs are validated using Class Validators and Validation Pipe in root with useGlobalPipes.

## Prisma Migrations

Migrations are used to setup the database in schema.prisma file. To apply migrations and generate type files for prisma during development, run
- `npx prisma migrate dev`
You can check the validity of your schema by running
- `npx prisma validate`

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