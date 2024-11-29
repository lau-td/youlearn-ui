export interface Document {
  id: string;
  name: string;
  youtubeId: string;
  conversationId: string | null;
  parentMessageId: string | null;
}
