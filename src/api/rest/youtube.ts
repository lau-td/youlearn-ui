import axiosInstance from "./axios-config";
import { YoutubeInfo, YoutubeSummary, YoutubeTranscript } from "../interfaces";

export const uploadYoutubeVideos = async (urls: string[]) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.post<any>(
    "/uploader/youtube",
    {
      urls,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const getYoutubeTranscripts = async (documentId: string) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.get<YoutubeTranscript[]>(
    `/youtube/transcript?documentId=${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getYoutubeInfo = async (documentId: string) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.get<YoutubeInfo>(
    `/youtube/info?documentId=${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getYoutubeSummary = async (documentId: string) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.get<YoutubeSummary>(
    `/youtube/summary?documentId=${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
