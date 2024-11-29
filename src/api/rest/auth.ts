import axios from "axios";
import { API_URL } from "./constant";

export const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
});

export const signup = async (email: string) => {
  const response = await authApi.post<{
    accessToken: string;
  }>("/signup", {
    email,
  });
  return response.data;
};

export const login = async (email: string) => {
  const response = await authApi.post<{
    accessToken: string;
  }>("/login", {
    email,
  });

  return response.data;
};
