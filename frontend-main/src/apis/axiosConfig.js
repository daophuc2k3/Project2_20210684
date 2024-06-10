import { LocalKeys, ROUTE_REFRESH_TOKEN } from "@constant/localStorage";
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BE_ENDPOINT,
});

instance.interceptors.request.use(
  function (config) {
    const userId = localStorage.getItem(LocalKeys.userId);
    const accessToken = localStorage.getItem(LocalKeys.accessToken);

    if (userId) {
      config.headers["x-client-id"] = userId;
    }

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

let countError = 0;
let refreshingFunc = null;

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  async function (error) {
    const { config, response } = error;
    const originalConfig = error.config;
    countError++;

    console.log(`countError ::: ${countError}`);

    console.log(response);

    if (countError >= 3 || !response?.data || !response || response?.status !== 401) {
      countError = 0;
      return Promise.reject(error);
    }

    const { data } = response;

    if (config?.url === ROUTE_REFRESH_TOKEN) {
      console.log(`error axios config refreshToken`, data);

      // Reset values auth

      return Promise.reject(error);
    }

    const { message } = data;

    if (message === "jwt expired") {
      const userId = localStorage.getItem(LocalKeys.userId);
      const refreshToken = localStorage.getItem(LocalKeys.refreshToken);

      try {
        const { metadata } = await instance.post("/auth/refresh-token", null, {
          headers: {
            "x-client-id": userId,
            "refresh-token": refreshToken,
          },
        });

        // instance.defaults.headers.common["Authorization"] = `Bearer ${metadata.tokens.accessToken}`;
        // instance.defaults.headers.common["x-client-id"] = userId;

        originalConfig?.headers.set("Authorization", `Bearer ${metadata.tokens.accessToken}`);
        originalConfig?.headers.set("x-client-id", userId);

        localStorage.setItem(LocalKeys.accessToken, metadata.tokens.accessToken);
        localStorage.setItem(LocalKeys.refreshToken, metadata.tokens.refreshToken);

        return await instance.request(originalConfig);
      } catch (error) {
        throw error;
      } finally {
        countError = 0;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
