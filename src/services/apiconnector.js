import axios from "axios";

export const axiosInstance = axios.create();

// Add response interceptor to handle ban responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if user is banned
    if (error.response?.status === 403 && error.response?.data?.isBanned) {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Show ban message (this will be handled by BanCheck component)
      console.log('User banned:', error.response.data.msg);
      
      // Reload page to trigger ban check
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};