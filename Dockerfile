# Required arguments for the application environment
ARG HOST
ARG REDIS_URL
ARG DATABASE_URL
ARG CORS_WHITELIST
ARG JWT_PRIVATE_KEY
# Optional arguments for the application environment
ARG CLUSTER=false
ARG THREAD_LIMIT=2
ARG JWT_ACCESSTOKEN_TTL='2h'
ARG JWT_REFRESHTOKEN_TTL='2w'

# Build the app
FROM node:16-slim as builder

WORKDIR /usr/builder/mms-backend

COPY ./package.json ./
COPY ./pnpm-lock.yaml ./

RUN apt update && apt upgrade -y
RUN npm -g install pnpm

RUN pnpm install
COPY ./ .

RUN npm run build

# Run the app
FROM node:16-slim

ARG HOST
ARG CLUSTER
ARG REDIS_URL
ARG THREAD_LIMIT
ARG DATABASE_URL
ARG CORS_WHITELIST
ARG JWT_PRIVATE_KEY
ARG JWT_ACCESSTOKEN_TTL
ARG JWT_REFRESHTOKEN_TTL

WORKDIR /usr/app/mms-backend

ENV NODE_ENV=production

ENV HOST $HOST
ENV CLUSTER $CLUSTER
ENV REDIS_URL $REDIS_URL
ENV THREAD_LIMIT $THREAD_LIMIT
ENV DATABASE_URL $DATABASE_URL
ENV CORS_WHITELIST $CORS_WHITELIST
ENV JWT_PRIVATE_KEY $JWT_PRIVATE_KEY
ENV JWT_ACCESSTOKEN_TTL $JWT_ACCESSTOKEN_TTL
ENV JWT_REFRESHTOKEN_TTL $JWT_REFRESHTOKEN_TTL

RUN apt update && apt upgrade -y
RUN npm -g install pnpm

COPY --from=builder /usr/builder/mms-backend/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /usr/builder/mms-backend/package.json ./package.json
COPY --from=builder /usr/builder/mms-backend/public ./public
COPY --from=builder /usr/builder/mms-backend/dist ./dist

RUN pnpm install --prod

EXPOSE 6900
CMD ["node", "dist"]
