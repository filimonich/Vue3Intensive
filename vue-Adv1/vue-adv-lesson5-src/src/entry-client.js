import createApp from "./app.js";

let { app, router } = createApp();
router.isReady().then(() => {
  app.mount("#app");
});
