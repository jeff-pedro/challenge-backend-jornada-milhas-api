ARG NODE_VERSION=22.11.0

FROM node:${NODE_VERSION} AS development

WORKDIR /usr/src/app

COPY package*.json ./
# install development dependencies
RUN npm ci --include=dev
# copy the configurations and source files
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY src/ src/
# build the Nest application
RUN npm run build



FROM node:${NODE_VERSION} AS test

ENV NODE_ENV=test

WORKDIR /usr/src/app

COPY . .

RUN npm ci --include=dev

CMD [ "sh", "-c", "npm run test" ] 



FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

ARG NODE_ENV=production

COPY package*.json ./
# install only production dependencies
RUN npm ci --omit=dev



# lightweight image for production
FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /app
# install utilities needed in our image
RUN apk --no-cache add curl postgresql-client

COPY package*.json ./
# copy the dependencies from the previous stages
COPY --from=builder /app/node_modules ./node_modules
COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000 443
# run migrations and start the application
CMD ["sh", "-c", "npx typeorm migration:run -d dist/database/data-source-cli.js && node dist/main.js"]
