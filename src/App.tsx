import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { uploadYoutubeVideos } from "./api/rest";
import Layout from "./components/layout";

const App: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await uploadYoutubeVideos([url]);
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">
          What do you want to learn today?
        </h1>

        <div className="relative">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube video URL"
            className="w-full pl-10 pr-12 py-6"
            disabled={isLoading}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button
              size="icon"
              onClick={handleSubmit}
              disabled={!url || isLoading}
            >
              {isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
