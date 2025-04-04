FROM node:22

RUN npm install -g @angular/cli@18.2.12

WORKDIR /
RUN mkdir angular-app
WORKDIR /angular-app

ENV APP_NAME 'smart-farm'
ENV ROUTING 'true'
ENV STANDALONE 'true'
ENV STRICT 'true'
ENV STYLE 'css'

CMD ng new $APP_NAME --routing=$ROUTING --standalone=$STANDALONE --strict=$STRICT --style=$STYLE \
    && mv $APP_NAME/* . \
    && rm -rf $APP_NAME \
    && ng serve --host 0.0.0.0 --port 4200 --disable-host-check

EXPOSE 4200
