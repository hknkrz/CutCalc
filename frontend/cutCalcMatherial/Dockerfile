FROM node:19.3.0
LABEL authors="hkn_krz"

WORKDIR /app/frontend

COPY . /app/frontend/

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]
