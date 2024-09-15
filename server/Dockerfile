FROM node:latest

WORKDIR /app

RUN apt-get update && \
apt-get install -y python3 python3-pip && \
apt-get clean

RUN ln -s /usr/bin/python3 /usr/bin/python

RUN pip install scikit-learn==1.5.1 pandas joblib xgboost --break-system-packages

RUN mkdir /app/routes

RUN mkdir /app/utils

RUN mkdir /app/model

COPY package.json /app

COPY package-lock.json /app

RUN npm install

COPY model /app/model

COPY .env /app

COPY routes /app/routes

COPY utils /app/utils

COPY index.js /app

CMD ["npx", "nodemon", "start"]
