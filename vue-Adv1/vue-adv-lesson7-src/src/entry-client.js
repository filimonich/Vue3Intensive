import getApp from "./app.js";

(async function () {
  let context = { isSSR: window.hasOwnProperty("SSR") };

  if (context.isSSR) {
    context.initialState = window.SSR.initialState;
    context.asyncData = window.SSR.asyncData;
    context.firstSSRPrint = true;
  }

  let { app, router } = await getApp(context);
  await router.isReady();
  app.mount("#app");
})();

import "bootstrap/dist/css/bootstrap.css";
