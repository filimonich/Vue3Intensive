import * as authApi from "@/api/auth.js";
import { setTokens, getJWTPayload } from "@/utils/tokens";

let readyRelosver;
let readyPromise = new Promise(function (resolve) {
  readyRelosver = resolve;
});

export default {
  namespaced: true,
  state: {
    user: null,
  },
  getters: {
    ready: (state) => readyPromise,
    isLogin: (state) => state.user !== null,
    //checkRole: state => allowedRoles => state.user !== null && allowedRoles.some(role => state.user.roles.includes(role))
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
    async autoLogin({ commit }) {
      let { res, user } = await authApi.check();

      if (res) {
        commit("setUser", user);
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
    clean({ commit }) {
      commit("setUser", null);
    },
  },
};
