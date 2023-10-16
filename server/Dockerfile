FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE $NODE_DOCKER_PORT

CMD ["npm", "start"]