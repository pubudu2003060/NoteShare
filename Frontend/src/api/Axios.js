import axios from "axios";

export const freeAxios = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const JWTAxios = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const longJWTAxios = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 3000000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

JWTAxios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      window.location.href = "/signin";
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

longJWTAxios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      window.location.href = "/signin";
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

JWTAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await freeAxios.post("/auth/refreshaccesstoken");

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return JWTAxios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        localStorage.removeItem("accessToken");
        // window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  }
);

longJWTAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await freeAxios.post("/auth/refreshaccesstoken");

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return JWTAxios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/signin";
      }
    }

    return Promise.reject(error);
  }
);
