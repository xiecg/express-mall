# express-mall

> Learn Express and MongoDB !

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8090
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## start

1. `mongod --config /usr/local/etc/mongod.conf`

2. `mongo`

3. `PORT=3030 node /server/bin/www`

4. `npm run dev`

## deploy

1. `pm2 deploy ecosystem.json production setup`

## docker

1. `docker build -t xiecg53/express-mall .`

2. `docker tag xiecg53/express-mall hub.c.163.com/xiecg53/express-mall:1.0.10`

3. `docker push hub.c.163.com/xiecg53/express-mall:1.0.10`

## server start

1. `docker run --name mall -p 3030:3030 -d hub.c.163.com/xiecg53/express-mall:1.0.10`
