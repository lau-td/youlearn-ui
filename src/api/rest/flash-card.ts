import { FlashCard } from "../interfaces";
import axiosInstance from "./axios-config";

export const getFlashCards = async (documentId: string) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.get<FlashCard[]>(
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
  const response = await axiosInstance.post<FlashCard[]>(
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
