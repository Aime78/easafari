import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Market-Header": "easafari",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Request sent: ", { config });

    //const token = import.meta.env.VITE_API_PROVIDER_TOKEN;
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status, response.data);
    return response.data;
  },
  (error) => {
    console.error("Response error:", error.response?.status, error.config?.url);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log("Unauthorized - redirecting to login");
          // Remove invalid token
          localStorage.removeItem("token");
          // Redirect to login (adjust based on your routing)
          window.location.href = "/login";
          break;
        case 403:
          console.log("Forbidden - insufficient permissions");
          break;
        case 404:
          console.log("Not found");
          break;
        case 500:
          console.log("Server error");
          break;
        default:
          console.log("Other error:", error.response.status);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("📡 Network error - no response received");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("⚙️ Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

//UTILITY FUNCTIONS

export const get = async <T>(url: string, config = {}): Promise<T> => {
  try {
    const response: T = await axiosInstance.get(url, config);
    return response;
  } catch (error) {
    console.log("error in get");

    throw error;
  }
};

export const post = async <T>(url: string, data = {}, config = {}) => {
  try {
    const response: T = await axiosInstance.post(url, data, config);
    return response;
  } catch (error) {
    console.log("error in post: ", error);

    throw error;
  }
};

export const put = async <T>(
  url: string,
  data = {},
  config = {}
): Promise<T> => {
  try {
    const response: T = await axiosInstance.put(url, data, config);
    return response;
  } catch (error) {
    console.log("error in put");

    throw error;
  }
};

export const del = async (url: string, data = {}) => {
  try {
    const response = await axiosInstance.delete(url, data);
    return response;
  } catch (error) {
    console.log("error in del");

    throw error;
  }
};
