import createApp from "./app.js";

async function initApp(context) {
  let { app, router, store } = createApp();
  await router.push(context.url);
  return { app, router, store };
}

export default initApp;
