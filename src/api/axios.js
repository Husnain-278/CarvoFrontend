import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
    headers:{
        'Content-Type': 'application/json'
    },
    timeout: 10000,
})

const clearAuthStorage = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
};

const refreshToken = async () => {
  const refresh = localStorage.getItem("refreshToken");

    const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/token/refresh/",
        { refresh },
        { timeout: 10000 }
    );

  localStorage.setItem("accessToken", response.data.access);
  return response.data.access;
};

axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem('accessToken')
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error)=>Promise.reject(error)
)

axiosInstance.interceptors.response.use(
    (response)=> response,
    async(error)=>{
       const originalRequest = error.config
       if(error.response?.status === 401 && !originalRequest._retry){
        originalRequest._retry = true
        try {
            const newAccessToken = await refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            // Refresh token is expired or invalid — log the user out
            clearAuthStorage();
            return Promise.reject(refreshError);
        }
       }
       return Promise.reject(error)
    }
)

export default axiosInstance