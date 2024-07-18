#stage 1

FROM node:iron-slim AS node

WORKDIR /app
COPY ./angular.json .
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY . .



ARG BACKEND_IP=TEST
ENV BACKEND_IP=$BACKEND_IP
ARG BACKEND_PORT=8080
ENV BACKEND_PORT=$BACKEND_PORT

RUN apt update && apt install gettext -y

RUN envsubst < src/environments/environment.prod.ts > src/environments/environment.tmp.ts
RUN mv src/environments/environment.tmp.ts src/environments/environment.prod.ts

RUN cat src/environments/environment.prod.ts

RUN npm run build --build-optimizer


#stage 2
FROM nginx:alpine
LABEL name="frontend-nginx"
COPY --from=node /app/dist/digi_log_fe/browser /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/digi_log.conf
EXPOSE 80
