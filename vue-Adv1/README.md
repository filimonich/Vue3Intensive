# vue-ssr-simple

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

json
"scripts": {
"serve": "vue-cli-service serve",
"build:client": "vue-cli-service build",
"build:server": "vue-cli-service build --no-clean --server",
"build": "npm run build:client && npm run build:server",
"devbuild:client": "vue-cli-service build --mode development",
"devbuild:server": "vue-cli-service build --no-clean --server --mode development",
"devbuild": "npm run devbuild:client && npm run devbuild:server",
"watch:client": "vue-cli-service build --no-clean --mode development --watch",
"watch:server": "vue-cli-service build --no-clean --server --mode development --watch",
"server": "node server.js",
"good": "concurrently \"npm run server\" \"npm run watch:client\" \"npm run watch:server\""
}

- `"serve": "vue-cli-service serve"`: Запускает сервер разработки для вашего Vue-приложения.
- `"build:client": "vue-cli-service build"`: Собирает клиентскую часть Vue-приложения для развертывания на сервере.
- `"build:server": "vue-cli-service build --no-clean --server"`: Собирает серверную часть Vue-приложения без очистки предыдущих сборок.
- `"build": "npm run build:client && npm run build:server"`: Запускает сборку клиентской и серверной частей приложения последовательно.
- `"devbuild:client": "vue-cli-service build --mode development"`: Собирает клиентскую часть Vue-приложения для разработки в режиме разработки.
- `"devbuild:server": "vue-cli-service build --no-clean --server --mode development"`: Собирает серверную часть Vue-приложения для разработки в режиме разработки без очистки предыдущих сборок.
- `"devbuild": "npm run devbuild:client && npm run devbuild:server"`: Запускает сборку клиентской и серверной частей разработческого приложения последовательно.
- `"watch:client": "vue-cli-service build --no-clean --mode development --watch"`: Запускает наблюдение за изменениями в клиентской части Vue-приложения в режиме разработки.
- `"watch:server": "vue-cli-service build --no-clean --server --mode development --watch"`: Запускает наблюдение за изменениями в серверной части Vue-приложения в режиме разработки без очистки предыдущих сборок.
- `"server": "node server.js"`: Запускает сервер, который используется для развертывания серверной части приложения.
- `"good": "concurrently \"npm run server\" \"npm run watch:client\" \"npm run watch:server\""`: Параллельно запускает сервер и наблюдение за изменениями в клиентской и серверной частях приложения.

Надеюсь, эти комментарии помогут вам понять каждую строку кода в вашем `package.json`. Если у вас есть ещё вопросы, не стесняйтесь задавать!
