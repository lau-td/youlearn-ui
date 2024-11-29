export interface YoutubeInfo {
  name: string;
  videoId: string;
  url: string;
}

export interface YoutubeTranscript {
  start: number;
  end: number;
  text: string;
}

export interface YoutubeSummary {
  result: string;
}
