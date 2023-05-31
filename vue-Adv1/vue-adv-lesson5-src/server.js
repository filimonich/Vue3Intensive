const path = require("path");
const fs = require("fs");
const express = require("express");
const server = express();

const { renderToString } = require("@vue/server-renderer");
const serverBundle = require("./dist/js/server-bundle.js");
const template = fs.readFileSync("./dist/index.html", "utf-8");

server.use("/css", express.static(path.resolve(__dirname, "./dist/css")));
server.use("/js", express.static(path.resolve(__dirname, "./dist/js")));
server.use("/img", express.static(path.resolve(__dirname, "./dist/img")));
server.use(
  "/favicon.ico",
  express.static(path.resolve(__dirname, "./dist/favicon.ico"))
);

server.get("*", (request, response) => {
  let context = { url: request.url };

  serverBundle(context).then((bundle) => {
    renderToString(bundle.app).then(
      (html) => {
        let page = template.replace("<!--ssr-app-here-->", html).replace(
          "<!--ssr-state-here-->",
          `<script>
						window.SSRVuexInitialState = ${JSON.stringify(bundle.store.state)};
					</script>`
        );

        response.end(page);
      },
      (err) => {
        console.log(err);
        response.end("error");
      }
    );
  });
});

server.listen(3000);
console.log("server run...");
