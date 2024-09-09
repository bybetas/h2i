FROM node:21.7.0

WORKDIR /app

COPY . .

RUN npm install && \
    npx playwright install-deps && \
    npx playwright install && \
    npm install -g pm2

EXPOSE 8888

CMD ["pm2-runtime", "start", "h2i.js", "--name", "h2i-app", "-i", "4"]
