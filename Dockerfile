FROM node:10

ADD package.json /src/package.json

RUN cd /src && npm install --production

ADD . /src

WORKDIR /src

ENV NODE_ENV=production

CMD ["npm", "start"]