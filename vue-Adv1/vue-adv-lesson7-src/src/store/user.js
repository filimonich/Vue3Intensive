import {
  setTokens,
  cleanTokensData,
  getJWTPayload,
  getAccessToken,
} from "@/utils/tokens";

export default (authApi) => {
  let readyRelosver;
  let readyPromise = new Promise(function (resolve) {
    readyRelosver = resolve;
  });

  return {
    namespaced: true,
    state: {
      user: null,
    },
    getters: {
      userName: (state) => state.user.name,
      ready: (state) => readyPromise,
      isLogin: (state) => state.user !== null,
      checkRole: (state) => (allowedRoles) =>
        state.user !== null &&
        allowedRoles.some((role) => state.user.roles.includes(role)),
    },
    mutations: {
      setUser(state, user) {
        state.user = user;
      },
    },
    actions: {
      async autoLogin({ commit }) {
        if (process.isClient) {
          let { res } = await authApi.check();

          if (res) {
            let { login, name, roles } = getJWTPayload(getAccessToken());
            commit("setUser", { login, name, roles });
          }
        }

        readyRelosver();
      },
      async login({ commit }, { login, password }) {
        let { res, data } = await authApi.login(login, password);

        if (!res) {
          return { errors: "Нет связи" };
        } else if (data.res) {
          setTokens(data.accessToken);
          let { login, name, roles } = getJWTPayload(data.accessToken);
          commit("setUser", { login, name, roles });
        }

        return data;
      },
      async logout({ dispatch }) {
        let { res } = await authApi.logout();

        if (res) {
          dispatch("clean");
        }

        return res;
      },
      clean({ commit }) {
        cleanTokensData();
        commit("setUser", null);
      },
    },
  };
};
