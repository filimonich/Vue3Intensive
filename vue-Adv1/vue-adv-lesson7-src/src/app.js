import { createSSRApp, createApp } from "vue";
import App from "./App.vue";
import initNewHttp from "./api/http";
import initNewApi from "./api/index";
import initNewRouter from "./router";
import initNewStore from "./store";

import connectHttpWithTokens from "./connectors/tokens";
import connectHttpErrorsHandlers from "./connectors/errors";
import connectAsyncData from "./connectors/async";

async function getApp(context) {
  try {
    let app;
    let http = initNewHttp();
    let api = initNewApi(http);
    let store = initNewStore(api);
    let router = initNewRouter(store);

    connectHttpWithTokens(http);
    connectHttpErrorsHandlers(http, store, router);
    connectAsyncData(context, api, router);

    store.dispatch("user/autoLogin");

    if (process.isClient) {
      store.dispatch("cart/load");

      if (context.isSSR) {
        store.replaceState(context.initialState);
      } else {
        await store.dispatch("products/load");
      }

      app = simpleCreateApp(App, api, store, router, context.isSSR);
    } else {
      app = simpleCreateApp(App, api, store, router, true);
      await store.dispatch("products/load");
    }

    return { app, router, store };
  } catch (e) {
    throw { code: 500, nativeError: e };
  }
}

function simpleCreateApp(App, api, store, router, isSsr) {
  let createUniversalApp = isSsr ? createSSRApp : createApp;
  let app = createUniversalApp(App);
  app.config.globalProperties.$api = api;
  return app.use(store).use(router);
}

export default getApp;
