export default function connectAsyncData(context, api, router) {
  router.beforeEach((to, from, next) => {
    let cmps = to.matched
      .flatMap((record) => Object.values(record.components))
      .filter((cmp) => "asyncData" in cmp);

    if (context.firstSSRPrint) {
      context.firstSSRPrint = false;
      apllyAsyncData(cmps, context.asyncData);
      next();
    } else {
      Promise.all(cmps.map((cmp) => cmp.asyncData(api, to.params))).then(
        (results) => {
          apllyAsyncData(cmps, results);
          context.asyncData = results;
          next();
        }
      );
    }
  });
}

function apllyAsyncData(cmps, results) {
  cmps.forEach((cmp, i) => {
    let nativeData = cmp.data;

    cmp.data = function () {
      let syncData = nativeData.call(this);
      let asyncData = results[i];
      cmp.data = nativeData;
      return { ...syncData, ...asyncData };
    };
  });
}
