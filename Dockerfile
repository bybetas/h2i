FROM node:21

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npx playwright install-deps

COPY . .

EXPOSE 8888

CMD ["node", "h2i.js"]