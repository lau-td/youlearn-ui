import axios from "axios";
import { Chapter } from "../interfaces";
import { API_URL } from "./constant";

export const chapterApi = axios.create({
  baseURL: `${API_URL}/chapters`,
});

export const getChapters = async (documentId: string) => {
  const token = localStorage.getItem("token");
  const response = await chapterApi.get<Chapter[]>(
    `/?documentId=${documentId}`,
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
  const response = await chapterApi.post<{ result: string }>(
    `/generate`,
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
