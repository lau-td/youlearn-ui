import { useParams } from "react-router-dom";
import {
  FlashCard,
  YoutubeInfo,
  YoutubeSummary,
  YoutubeTranscript,
} from "@/api/interfaces";
import {
  getFlashCards,
  getYoutubeInfo,
  getYoutubeSummary,
  getYoutubeTranscripts,
  createFlashCards,
} from "@/api/rest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import ReactMarkdown from "react-markdown";
import { FlashCard as FlashCardComponent } from "@/components/flash-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { streamChat } from "@/api/rest/chat";
import { getChatMessages } from "@/api/rest/chat";
import { getChapters, generateChapters } from "@/api/rest";
import { Chapter } from "@/api/interfaces";

interface Message {
  role: string;
  content: string;
  isLoading?: boolean;
}

const YoutubeDocument: React.FC = () => {
  const { documentId } = useParams();
  const [youtubeInfo, setYoutubeInfo] = useState<YoutubeInfo | null>(null);
  const [transcripts, setTranscripts] = useState<YoutubeTranscript[]>([]);
  const [flashCards, setFlashCards] = useState<FlashCard[]>([]);
  const [summary, setSummary] = useState<YoutubeSummary | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<
    Array<{
      role: string;
      content: string;
      isLoading?: boolean;
    }>
  >([
    {
      role: "assistant",
      content:
        "Hi! I can help you understand this video better. What questions do you have?",
    },
  ]);
  const [input, setInput] = useState("");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isGeneratingChapters, setIsGeneratingChapters] = useState(false);

  useEffect(() => {
    setCurrentCardIndex(0);
    setSummary(null);
    setFlashCards([]);
    setTranscripts([]);
    setYoutubeInfo(null);
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! I can help you understand this video better. What questions do you have?",
      },
    ]);

    if (!documentId) return;

    getYoutubeInfo(documentId).then((data) => {
      setYoutubeInfo(data);
    });

    getYoutubeSummary(documentId).then((data) => {
      setSummary(data);
    });

    getYoutubeTranscripts(documentId).then((data) => {
      setTranscripts(data);
    });

    getFlashCards(documentId).then((data) => {
      setFlashCards(data);
    });

    fetchChatMessages();
    getChapters(documentId).then((data) => {
      setChapters(data);
    });
  }, [documentId]);

  const handleNextCard = () => {
    if (currentCardIndex < flashCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleGenerateFlashCards = async () => {
    if (!documentId) return;

    try {
      setIsGenerating(true);
      const newFlashCards = await createFlashCards(documentId);
      setFlashCards(newFlashCards);
    } catch (error) {
      console.error("Failed to generate flashcards:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !documentId) return;

    const userMessage = { role: "user" as const, content: input.trim() };
    const assistantMessage = {
      role: "assistant" as const,
      content: "",
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");

    try {
      let fullResponse = "";
      await streamChat(documentId, input.trim(), (chunk) => {
        fullResponse += chunk;
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === "assistant") {
            lastMessage.content = fullResponse;
          }
          return newMessages;
        });
      });

      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === "assistant") {
          lastMessage.isLoading = false;
        }
        return newMessages;
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === "assistant") {
          lastMessage.content =
            "Sorry, I encountered an error while processing your message.";
          lastMessage.isLoading = false;
        }
        return newMessages;
      });
    }
  };

  const fetchChatMessages = async () => {
    if (!documentId) return;

    try {
      const chatMessages = await getChatMessages(documentId);

      // Convert API messages to our message format
      const formattedMessages: Message[] = [
        {
          role: "assistant",
          content:
            "Hi! I can help you understand this video better. What questions do you have?",
        },
        ...chatMessages.data
          .map((msg) => [
            {
              role: "user",
              content: msg.query,
            },
            {
              role: "assistant",
              content: msg.answer,
            },
          ])
          .flat(),
      ];

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to fetch chat messages:", error);
    }
  };

  const handleGenerateChapters = async () => {
    if (!documentId) return;

    try {
      setIsGeneratingChapters(true);
      await generateChapters(documentId);
      // Fetch the newly generated chapters
      const newChapters = await getChapters(documentId);
      setChapters(newChapters);
    } catch (error) {
      console.error("Failed to generate chapters:", error);
    } finally {
      setIsGeneratingChapters(false);
    }
  };

  return (
    <Layout>
      <div
        className="flex flex-row min-h-screen"
        style={{ width: "calc(100vw - 18.75rem)" }}
      >
        {/* Left sidebar */}
        <div className="flex-1 flex flex-col px-2">
          {/* Video Player Section */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeInfo?.videoId}?enablejsapi=1`}
              title={youtubeInfo?.name || "YouTube video player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Tabs Section */}
          <div className="mt-4">
            <Tabs defaultValue="chapters" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0">
                <TabsTrigger
                  value="chapters"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Chapters
                </TabsTrigger>
                <TabsTrigger
                  value="transcripts"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Transcripts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transcripts">
                <div className="p-4 space-y-4 max-h-[calc(100vh-30rem)] overflow-y-auto">
                  {transcripts.reduce(
                    (pairs: React.ReactNode[], transcript, index, array) => {
                      // Format seconds to HH:MM:SS
                      const formatTime = (seconds: number) => {
                        const hours = Math.floor(seconds / 3600);
                        const minutes = Math.floor((seconds % 3600) / 60);
                        const remainingSeconds = Math.floor(seconds % 60);
                        return `${hours.toString().padStart(2, "0")}:${minutes
                          .toString()
                          .padStart(2, "0")}:${remainingSeconds
                          .toString()
                          .padStart(2, "0")}`;
                      };

                      // Combine every two transcripts
                      if (index % 2 === 0) {
                        const currentTranscript = transcript;
                        const nextTranscript = array[index + 1];

                        const combinedText = nextTranscript
                          ? `${currentTranscript.text} ${nextTranscript.text}`
                          : currentTranscript.text;

                        pairs.push(
                          <div
                            key={index}
                            className="flex gap-2 p-2 hover:bg-accent rounded-lg cursor-pointer group transition-colors"
                          >
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {formatTime(currentTranscript.start)}
                            </span>
                            <p className="text-sm group-hover:text-primary">
                              {combinedText}
                            </p>
                          </div>
                        );
                      }
                      return pairs;
                    },
                    []
                  )}
                </div>
              </TabsContent>

              <TabsContent value="chapters" className="flex-1 overflow-hidden">
                <div className="w-full flex flex-col p-4">
                  <div className="flex-1 space-y-2 overflow-y-auto max-h-[calc(100vh-30rem)]">
                    {chapters.length > 0 ? (
                      chapters.map((chapter) => (
                        <ChapterItem
                          key={chapter.id}
                          timestamp={chapter.subtitle}
                          title={chapter.title}
                          description={chapter.content}
                        />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-4 py-8">
                        <p className="text-sm text-muted-foreground text-center">
                          No chapters available
                        </p>
                        <Button
                          onClick={handleGenerateChapters}
                          disabled={isGeneratingChapters}
                          className="w-fit"
                        >
                          {isGeneratingChapters ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
                              Generating...
                            </>
                          ) : (
                            "Generate Chapters"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right sidebar with tabs */}
        <div className="flex-1 flex flex-col border-l px-2">
          <Tabs defaultValue="summary" className="w-full flex flex-col">
            <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0 shrink-0">
              <TabsTrigger
                value="chat"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="flashcards"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Flashcards
              </TabsTrigger>
              <TabsTrigger
                value="summary"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Summary
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1">
              <div className="flex flex-col h-full">
                {/* Messages container */}
                <div className="flex-1 p-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={cn("flex", {
                          "justify-end": message.role === "user",
                          "justify-start": message.role === "assistant",
                        })}
                      >
                        <div
                          className={cn(
                            "rounded-lg px-4 py-2 max-w-[80%] text-sm",
                            {
                              "bg-primary text-primary-foreground":
                                message.role === "user",
                              "bg-muted": message.role === "assistant",
                            }
                          )}
                        >
                          {message.content}
                          {message.isLoading && (
                            <span className="ml-2 animate-pulse">...</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input form */}
                <div className="p-4 border-t">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask a question..."
                      className="min-h-[60px] max-h-[180px]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button type="submit" size="icon" disabled={!input.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="flashcards" className="flex-1">
              <div className="w-full flex flex-col p-4">
                {flashCards.length > 0 ? (
                  <FlashCardComponent
                    question={flashCards[currentCardIndex].question}
                    answer={flashCards[currentCardIndex].answer}
                    currentIndex={currentCardIndex}
                    totalCards={flashCards.length}
                    onNext={handleNextCard}
                    onPrevious={handlePreviousCard}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <p className="text-sm text-muted-foreground text-center">
                      No flashcards available
                    </p>
                    <Button
                      onClick={handleGenerateFlashCards}
                      disabled={isGenerating}
                      className="w-fit"
                    >
                      {isGenerating ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Generating...
                        </>
                      ) : (
                        "Generate Flashcards"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="summary" className="flex-1">
              <div className="p-4 max-h-[calc(100vh-6.25rem)] overflow-y-auto">
                <article className="prose prose-sm dark:prose-invert prose-headings:font-heading prose-headings:leading-tight prose-lead:text-muted-foreground prose-a:text-primary max-w-none">
                  <ReactMarkdown>{summary?.result || ""}</ReactMarkdown>
                </article>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

interface ChapterItemProps {
  timestamp: string;
  title: string;
  description: string;
}

const convertTimestampToSeconds = (timestamp: string): number => {
  const [minutes, seconds] = timestamp.split(':').map(Number);
  return minutes * 60 + seconds;
};

const ChapterItem: React.FC<ChapterItemProps> = ({
  timestamp,
  title,
  description,
}) => {
  const handleClick = () => {
    // Get the YouTube iframe element
    const iframe = document.querySelector<HTMLIFrameElement>('iframe');
    if (!iframe?.contentWindow) return;

    // Convert the timestamp to seconds
    const seconds = convertTimestampToSeconds(timestamp);

    // Send postMessage to YouTube player
    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func: 'seekTo',
        args: [seconds, true]
      }), 
      '*'
    );
  };

  return (
    <div 
      className="flex gap-4 p-4 hover:bg-accent rounded-lg cursor-pointer group"
      onClick={handleClick}
    >
      <span className="text-sm text-muted-foreground font-medium">
        {timestamp}
      </span>
      <div className="flex-1">
        <h3 className="font-medium mb-1 group-hover:text-primary">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};

export default YoutubeDocument;
