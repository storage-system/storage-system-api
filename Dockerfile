FROM node:lts-slim AS builder

WORKDIR /app

COPY ./package*.json .

RUN npm i

COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:lts-slim AS runner

RUN apt-get update -y && apt-get install -y openssl

RUN npm install pm2 -g

WORKDIR /app

COPY --from=builder /app/package*.json .

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/prisma ./prisma

RUN npm i --omit=dev --ignore-scripts

RUN npx prisma generate

CMD ["pm2-runtime" , "dist/src/infrastructure/main.js"]