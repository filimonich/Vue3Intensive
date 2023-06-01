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

server.get("*", function (request, response) {
  let context = { url: request.url };

  serverBundle(context).then(({ app, store, router }) => {
    let noSsr = router.currentRoute.value.matched.some(
      (r) => r.meta.auth || r.meta.noSSR
    );

    if (noSsr) {
      response.end(template);
    } else {
      renderToString(app).then(
        (html) => {
          let initialState = JSON.stringify(store.state);
          let page = template.replace("<!--ssr-app-here-->", html).replace(
            "<!--ssr-state-here-->",
            `
							<script>
								window.INITIAL_STATE = ${initialState};
							</script>
						`
          );
          response.status(200).end(page);
        },
        (err) => {
          console.log("err", err);
          response.end("error");
        }
      );
    }
  });
});

server.listen(3000);
console.log("start...");
