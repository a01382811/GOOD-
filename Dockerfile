FROM node:18-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV OWNER_NUMBER=22784566540

CMD ["npm", "start"]
