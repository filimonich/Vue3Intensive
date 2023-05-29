import axios from "axios";
import { getAccessToken, setTokens, cleanTokensData } from "@/utils/tokens";

const baseURL = "https://wp.dmitrylavrik.ru/vue-advanced-api-l3/";
const instance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
});

instance.interceptors.request.use(addAccessToken);

instance.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error.response.status !== 401) {
      return Promise.reject(error); // ошибка, не связанная с авторизацией
    }

    cleanTokensData();
    let response = await instance.get("auth/refresh/refresh.php");

    if (!response.data.res) {
      return Promise.reject(error); // прокидываем 401 код дальше
    }

    setTokens(response.data.accessToken);
    return axios(addAccessToken(error.config));
  }
);

export function addResponseHandler(success, error) {
  instance.interceptors.response.use(success, error);
}

export default instance;

function addAccessToken(request) {
  let token = getAccessToken();

  if (token !== null) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
}
