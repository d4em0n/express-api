FROM node:alpine

WORKDIR /usr/src/app

# create the directory inside the container
EXPOSE 3000

COPY . /usr/src/app
COPY package.json package.json

RUN npm install

# the command that starts our app
CMD ["npm", "start"]
