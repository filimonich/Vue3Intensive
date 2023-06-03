export default function connectHttpErrorsHandlers(http, store, router) {
  http.interceptors.response.use(packResponse, function (error) {
    code401Logout(error, store, router);
    return connectErrorsWithAlerts(error, store);
  });
}

function packResponse(response) {
  if ("errorAlert" in response.config) {
    response.data = { res: true, data: response.data };
  }

  return response;
}

function code401Logout(error, store, router) {
  if (error.response?.status == 401 && error.config.appSilence401 !== true) {
    store.dispatch("user/clean");

    if (process.isClient) {
      router.push({ name: "login" }).then(() => {
        location.reload();
      });
    }
  }
}

function connectErrorsWithAlerts(error, store) {
  let config = error.config;

  if ("errorAlert" in config) {
    let { errorAlert } = config;

    if (typeof errorAlert === "string") {
      errorAlert = { text: errorAlert };
    }

    store.dispatch("alerts/add", {
      text: "Ошибка ответа от сервера " + errorAlert.text,
      timeout: errorAlert.timeout ?? 5000,
      critical: errorAlert.critical ?? false,
    });

    return { data: { res: false, data: null } };
  }

  return Promise.reject(error);
}
