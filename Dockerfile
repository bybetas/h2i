FROM node:21

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npx playwright install-deps

COPY . .

EXPOSE 8888

# Start the application
CMD ["node", "your-server-file.js"]
