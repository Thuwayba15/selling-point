import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const getAxiosInstance = () =>
  axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

export const api = getAxiosInstance();
