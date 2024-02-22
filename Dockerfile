ARG BASE_IMAGE=node:19-alpine3.17

FROM $BASE_IMAGE as builder
RUN apk add --no-cache bash git
WORKDIR /app
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./.npmrc ./
RUN npm install -g husky
RUN CI=true npm ci
COPY . ./
RUN NODE_ENV=production npm run build

FROM $BASE_IMAGE as production
RUN apk update && apk upgrade libcrypto3 libssl3
WORKDIR /app
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV TZ=Asia/Bangkok

EXPOSE 3000

CMD ["npm", "start"]