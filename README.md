<p align="right">
  <a href="./README.md" title="english">
    <img src="./docs/img/usa.png" alt="english doc" width="30">
  </a>
  <a href="./docs/README_pt-br.md" title="portuguese">
    <img src="./docs/img/brazil.png" alt="portuguese doc" width="30">
  </a>
<p align="center">

<h1 align="center">Challenge Backend: Jornada Milhas</h1>

<p align="center">
  <a href="" target="_blank"><img src="docs/img/logo.png" width="300" alt="Jornada Milhas logo" /></a>
<p align="center">

<p align="center">
  API for a fictional website that provides information about potential travel destinations.  
<p align="center">

## Descrição

Restful API for the travel destination recommendation site [Jornada Milhas](https://api.jornadamilhas.sapituca.site) developed during the Challenge Back-End by <a href="https://cursos.alura.com.br" target="_blank">Alura</a>.

## About the Challenge

This project was developed in `TypeScript` and `NestJS`, using `TypeORM` as the data access layer. The main goal of this project is to apply and practice pre-acquired knowledge in these technologies while taking the opportunity to improve programming techniques, learn more about software design, and deepen the understanding of the technologies used during development.

The challenge was divided into four weeks, with deliverables for each week.**GitHub Projects** was used to manage the [Jornada Milhas project](https://github.com/users/jeff-pedro/projects/4) and its tasks.

## Documentation

For project details, see the documentation on the [Github Wiki](https://github.com/jeff-pedro/challenge-backend-jornada-milhas/wiki).

## Technologies Used

![Node.js](https://img.shields.io/badge/Node.js-white?style=for-the-badge&logo=node.js&logoColor=green)
![Nest.js](https://img.shields.io/badge/Nest.js-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=TypeORM&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-F6F5F2?style=for-the-badge&logo=postgresql&logoColor=blue)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)
![EsLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Github Action](https://img.shields.io/badge/Github_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Render](https://img.shields.io/badge/Render-000000?style=for-the-badge&logo=render&logoColor=white)

## Prerequisites

* [Node.js v22.11.0](https://nodejs.org/en/download)
* NPM v10.9.0
* [PostgreSQL](https://www.postgresql.org/download/) / [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/linux/)
* [Cohere API Key](https://dashboard.cohere.com/api-keys)

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project’s root directory.

```bash
touch .env
```

Fill it with the configured database values and the Cohere API Key.

```bash
# COHERE AI
COHERE_API_KEY=""

# DATABASE
DB_HOST=""
DB_PORT=""
DB_USERNAME=""
DB_PASSWORD=""
DB_NAME=""
```

## Launching the Infrastructure (Optional)

Starting the database with `docker compose`

```bash
cd ./challenge-backend-jornada-milhas
docker compose up -d 
```

## Running the App

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# coverage tests
npm run test:cov
```

## Migrations

```bash
# generate migration file
npm run typeorm migration:generate src/db/migration/[migration-name]

# run migration
npm run typeorm migration:run
```

## Contact

* Author - [Jefferson Santos](https://jefferson.sapituca.site)
* Website - [https://jornadamilhas.sapituca.site](https://jornadamilhas.sapituca.site)
* LinkedIn - [in/jeffersonpedro](https://www.linkedin.com/in/jeffersonpedro)
