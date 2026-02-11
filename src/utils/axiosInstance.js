import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true 
})

//this is request interceptor
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

//This is Auto Refresh Interceptor
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