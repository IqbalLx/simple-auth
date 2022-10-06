FROM node:16.15.0-alpine3.14 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --quiet

COPY ./prisma prisma
COPY ./src src
COPY ./tsconfig.json .

RUN npm run build

FROM node:16.15.0-alpine3.14 as prod

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production --quiet

COPY --chown=node:node --from=build /app/prisma ./dist/prisma
COPY --chown=node:node --from=build /app/dist/src ./dist/src

RUN npx prisma generate --schema=./dist/prisma/schema.prisma

EXPOSE 3000

USER node

ENTRYPOINT [ "npm", "run", "prod" ]
