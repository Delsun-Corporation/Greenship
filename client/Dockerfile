# Dockerfile for React client

FROM node:16.20.2-alpine3.18

# Working directory be app
WORKDIR ../client

###  Installing dependencies
COPY public/ ./public
COPY src/ ./src
COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","start"]