import axios from "axios";
import { YoutubeInfo, YoutubeSummary, YoutubeTranscript } from "../interfaces";
import { API_URL } from "./constant";

export const youtubeApi = axios.create({
  baseURL: `${API_URL}`,
});

export const uploadYoutubeVideos = async (urls: string[]) => {
  const token = localStorage.getItem("token");
  const response = await youtubeApi.post<any>(
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
  const response = await youtubeApi.get<YoutubeTranscript[]>(
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
  const response = await youtubeApi.get<YoutubeInfo>(
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
  const response = await youtubeApi.get<YoutubeSummary>(
    `/youtube/summary?documentId=${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
