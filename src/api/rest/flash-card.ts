import axios from "axios";
import { FlashCard } from "../interfaces";

import { API_URL } from "./constant";

export const flashCardApi = axios.create({
  baseURL: `${API_URL}`,
});

export const getFlashCards = async (documentId: string) => {
  const token = localStorage.getItem("token");
  const response = await flashCardApi.get<FlashCard[]>(
    `/llm-tasks/flash-card?documentId=${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const createFlashCards = async (documentId: string) => {
  const token = localStorage.getItem("token");
  const response = await flashCardApi.post<FlashCard[]>(
    `/llm-tasks/flash-card`,
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
