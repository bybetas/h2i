FROM node:21.7.0

WORKDIR /app

COPY . .

RUN npm install && \
    npx playwright install-deps && \
    npx playwright install

EXPOSE 8888

CMD ["node", "h2i.js"]
