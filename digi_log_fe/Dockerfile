#stage 1

FROM node:18.13 as node

WORKDIR /app
COPY ./angular.json .
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY . .

ARG BACKEND_IP
ENV BACKEND_IP $BACKEND_IP
ARG BACKEND_PORT
ENV BACKEND_PORT $BACKEND_PORT



RUN envsubst < src/environments/environment.ts > src/environments/environment.tmp.ts
RUN mv src/environments/environment.tmp.ts src/environments/environment.ts

RUN cat src/environments/environment.ts

RUN npm run build --build-optimizer

#stage 2
FROM nginx:alpine
LABEL name="frontend-nginx"
COPY --from=node /app/dist/digi_log_fe/browser /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/digi_log.conf
EXPOSE 80

# CMD sh