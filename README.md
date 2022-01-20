# ErWIn ISLE

TODO: badges for build and test status

## Introduction

TODO: short project/repo introduction

## Installation

```bash
$ npm install
```

For persistance, you may use the provided Docker configuration to boot your database. Copy `docker-compose.yml.example` to `docker-compose.yml`, and adjust the database credentials. Start the database container with:

```bash
docker-compose up
```

To configure ORM, copy the `mikro-orm.config.ts.example` to `mikro-orm.config.ts` and adjust the database configuration accordingly. To create the database schema run:

```bash
npx mikro-orm schema:create --run
```

Om update, you may migrate the database shema:

```bash
npx mikro-orm schema:update --run
```

Alternatively, drop the database before creating it:

```bash
npx mikro-orm schema:drop --run
npx mikro-orm schema:create --run
```

To configure user provisioning connection, copy `user-provisioning.config.json.example` to `user-provisioning.config.json`. Adjust the connection settings for the KeyCloak instance.

To configure educational provisioning connection, copy `educational-provisioning.config.example` to `educational-provisioning.config`. Adjust the connection settings for the Länder-API provider.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Swagger

You can find the SwaggerUI playground after you start the NestJS server with one of the commands from the
"Running the app" section. Type in the browser of your choice the URL `http://localhost:3000/swagger` or click
[here](http://localhost:3000/swagger).

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

This project is licensed under the [AGPL-3.0](./LICENSE).
