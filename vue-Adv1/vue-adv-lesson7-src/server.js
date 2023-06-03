const path = require("path");
const fs = require("fs");
const express = require("express");
const server = express();
const template = fs.readFileSync("./dist/index.html", "utf-8");
const { renderToString } = require("@vue/server-renderer");
const serverBundle = require("./dist/js/server-bundle.js");

server.use("/css", express.static(path.resolve(__dirname, "./dist/css")));
server.use("/js", express.static(path.resolve(__dirname, "./dist/js")));
server.use("/img", express.static(path.resolve(__dirname, "./dist/img")));
server.use(
  "/favicon.ico",
  express.static(path.resolve(__dirname, "./dist/favicon.ico"))
);

server.get("*", async function (request, response) {
  let context = { url: request.url, asyncData: null };

  try {
    let { app, store, router } = await serverBundle(context);
    let noSsr = router.currentRoute.value.matched.some(
      (r) => r.meta.auth || r.meta.noSSR
    );
    let is404 = router.currentRoute.value.matched.some((r) => r.meta.is404);

    if (noSsr || is404) {
      response.status(is404 ? 404 : 200).end(template);
    } else {
      try {
        let html = await renderToString(app);
        let initialSSR = {
          initialState: store.state,
          asyncData: context.asyncData,
        };

        let page = template.replace("<!--ssr-app-here-->", html).replace(
          "<!--ssr-state-here-->",
          `
						<script>
							window.SSR = ${JSON.stringify(initialSSR)};
						</script>
					`
        );
        response.status(router.appIs404 ? 404 : 200).end(page);
      } catch (err) {
        throw { code: 500, nativeError: e };
      }
    }
  } catch (e) {
    response.status(500).end("server sleep"); // template
  }
});

server.listen(3000);
console.log("start...");
