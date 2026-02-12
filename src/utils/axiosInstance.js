// it is acting like a security gurd and a token manager

import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true 
})

//this is request interceptor and it automatically attach the access token to every request.
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

//This is Auto Refresh Interceptor ( when access token expaires, on that time it will regenerate access token from refresh
// route and attacth it with the current refresh token without logout behaviour)
axiosInstance.interceptors.response.use(
  response => response,
  async error => {

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "http://localhost:5000/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("token", newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);

      } catch (err) {

        localStorage.clear();
        window.location.href = "/login";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;