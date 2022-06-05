# pull official base image
FROM node:16.15.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# install bash
RUN apk update && apk add bash

# expose port
EXPOSE 8000

# add app
COPY . ./

CMD npm run build
CMD npm run start:prod