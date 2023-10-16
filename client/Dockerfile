FROM node as build

WORKDIR /app

COPY package.json .

RUN npm install --force

COPY . .

ARG REACT_APP_SERVER_HOST

ENV REACT_APP_SERVER_HOST=$REACT_APP_SERVER_HOST

RUN npm run build

FROM nginx:1.19-alpine

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE $REACT_DOCKER_PORT

CMD nginx -g 'daemon off;'