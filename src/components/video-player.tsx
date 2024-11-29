import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoPlayerProps {
  videoId: string;
  title?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, title }) => {
  return (
    <div className="flex flex-col w-full h-full">
      {/* Video Player Section */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title || "YouTube video player"}
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
          <TabsContent value="chapters" className="mt-4">
            <div className="space-y-4">
              <ChapterItem
                timestamp="01:23"
                title="Channel Growth"
                description="The goal is to reach a billion YouTube subscribers..."
              />
              <ChapterItem
                timestamp="02:19"
                title="Collaborations Potential"
                description="Discussing the joy and dedication associated with football..."
              />
            </div>
          </TabsContent>
          <TabsContent value="transcripts">
            <div className="p-4">{/* Transcript content */}</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface ChapterItemProps {
  timestamp: string;
  title: string;
  description: string;
}

const ChapterItem: React.FC<ChapterItemProps> = ({
  timestamp,
  title,
  description,
}) => {
  return (
    <div className="flex gap-4 p-4 hover:bg-accent rounded-lg cursor-pointer group">
      <span className="text-sm text-muted-foreground font-medium">
        {timestamp}
      </span>
      <div className="flex-1">
        <h3 className="font-medium mb-1 group-hover:text-primary">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;
