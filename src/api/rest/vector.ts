import axiosInstance from "./axios-config";

export const storeDocument = (documentId: string) => {
  const token = localStorage.getItem("token");
  return axiosInstance.post(
    "/vector-store/store-document",
    { documentId },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
