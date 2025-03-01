FROM node:20-bookworm

WORKDIR /usr/src/app

COPY app/package*.json ./

RUN npm install

COPY app/ .

EXPOSE 2025

CMD ["npm", "start"]
