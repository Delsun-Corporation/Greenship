# Dockerfile for React client

FROM node:16.20.2-alpine3.18

# Working directory be app
WORKDIR ../server

###  Installing dependencies
COPY config/ ./config
COPY controllers/ ./controllers
COPY helpers/ ./helpers
COPY models/ ./models
COPY routes/ ./routes
COPY Screens/ ./Screens
COPY package.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm","run","dev"]