import { Document } from "@/api/interfaces";
import axiosInstance from "./axios-config";

export const getDocuments = async () => {
  const response = await axiosInstance.get<Document[]>("/documents");
  return response.data;
};
