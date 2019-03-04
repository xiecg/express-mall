FROM node:8.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install pm2 -g

COPY package.json /usr/src/app/
RUN cnpm install

COPY . /usr/src/app/

EXPOSE  3030
ENV ENV production
ENV PORT 3030

CMD ["pm2-docker", "process.yml"]

# sudo docker run --net host -p 3030:3030 -i -t hub.c.163.com/xiecg53/express-mall:0.0.7 /bin/bash
