FROM node:22-alpine

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli@18.2.12

RUN npm install

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check", "-c", "staging"]

EXPOSE 4200
