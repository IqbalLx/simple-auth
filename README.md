# simple-auth
### version: 1.0.0 (October 7, 2022)

## Project Description

This project is made as Iqbal Maulana's submission for Mitrais. To make clear separation of concern within the architecture we use [Clean Code Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).

## Build with

- [NodeJS](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Fastify](https://www.fastify.io/)

Package Description:
* **src/config** use this package to store any base configuration class e.g. WebSecurity, Http Configs, and so on.
* **src/entities** use this package to store entity used for this project.
* **src/repositories** use this package to store data layer interface.
* **src/dataSources** use this package to implement repositories inside each database used.
* **src/services** use this package to create new service to compute every business process needed from front-end or other backend who need this service.
* **src/controller** use this package to store any rest controller class for making request to this project.
* **src/routers** use this package to define endpoint routes to reach this project's service
* **src/validators** use this package to define rules for body, query, or params from incoming request.
* **src/utils** use this package to create new helper class that can be used in any class.

## Tools that might help to run or build this project

- [Node Version Manager](https://github.com/nvm-sh/nvm) used to help you to standardize development environment across different machines.
- [Docker](https://www.docker.com/) used to help you build this project.

## How to run this project
Make sure you already install NVM, follow how-to in their repo [here](https://github.com/nvm-sh/nvm)

open terminal cd to this project's root folder and run script below

    > nvm use
    > npm ci
    > npm run dev

or using Docker

    > docker build -t simple-auth:latest .
    > docker run --name simple-auth --env-file .env -p 3000:3000 -d simple-auth:latest

## Misc.
- You can find the API Docs from this project here: [Postman Docs](https://documenter.getpostman.com/view/23104123/2s83zfR64M)
- Docker repository container latest build from this project can be found here: [Dockerhub](https://hub.docker.com/repository/docker/iqballx/simple-auth)
