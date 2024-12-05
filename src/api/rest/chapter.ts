import { Chapter } from "../interfaces";
import axiosInstance from "./axios-config";

export const getChapters = async (documentId: string) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.get<Chapter[]>(
    `/chapters?documentId=${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const generateChapters = async (documentId: string) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.post<{ result: string }>(
    `/chapters/generate`,
    { documentId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
