FROM node:18-alpine

WORKDIR /app

RUN npm install -g @expo/cli

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 19006

CMD ["npx", "expo", "start", "--web", "--host", "0.0.0.0"]
