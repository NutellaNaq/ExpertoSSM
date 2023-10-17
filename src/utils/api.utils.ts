import axios from "axios";

// create axios instance
export const axiosInstance = axios.create({
  baseURL: "https://www.experto.ro/ExpertoBackend/orbit-laravel/public/api",
  timeout: 10000,

  headers: {
    // content type json
    "Content-Type": "application/json",
    // authorization token
  },
});

export type ApiResponseType = {
  error: boolean;
  message: string;
  [key: string]: any;
};

export const ApiResponse = {
  success: (response: any): ApiResponseType => response,
  error: (error: any | string): ApiResponseType => {
    if (error.response && error.response.status >= 500) {
      return {
        error: true,
        message: "Server Error",
      };
    }

    return {
      error: true,
      message: typeof error === "string" ? error : error.message,
    };
  },
};
