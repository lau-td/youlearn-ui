import axiosInstance from "./axios-config";

export const signup = async (email: string) => {
  const response = await axiosInstance.post<{
    accessToken: string;
  }>("auth/signup", {
    email,
  });
  return response.data;
};

export const login = async (email: string) => {
  const response = await axiosInstance.post<{
    accessToken: string;
  }>("auth/login", {
    email,
  });

  return response.data;
};
