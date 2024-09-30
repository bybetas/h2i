FROM node:21.7.0

WORKDIR /app

RUN chown -R node:node .

COPY --chown=node:node ./k8s/h2i .

RUN npm install && \
    npm install playwright && \
    npx playwright install-deps && \
    npm install -g pm2

USER node

RUN npx playwright install

CMD ["pm2-runtime", "start", "h2i.js", "--name", "h2i-app", "-i", "4"]
