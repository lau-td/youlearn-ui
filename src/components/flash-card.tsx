import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlashCardProps {
  question: string;
  answer: string;
  currentIndex: number;
  totalCards: number;
  onNext: () => void;
  onPrevious: () => void;
}

export const FlashCard = ({
  question,
  answer,
  currentIndex,
  totalCards,
  onNext,
  onPrevious,
}: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="flex flex-col h-full justify-center">
      <div className="perspective-[1000px] relative min-h-[400px] flex items-center">
        <Card
          className={cn(
            "w-full h-full absolute backface-hidden transition-all duration-500",
            !isFlipped
              ? "rotate-y-0"
              : "rotate-y-180 pointer-events-none opacity-0"
          )}
          onClick={() => setIsFlipped(true)}
        >
          <div className="p-8 flex flex-col items-center justify-center">
            <h3 className="text-xl font-medium text-center mb-4">Question</h3>
            <h3 className="text-xl text-center">{question}</h3>
          </div>
        </Card>

        <Card
          className={cn(
            "w-full h-full absolute backface-hidden transition-all duration-500 rotate-y-180",
            isFlipped
              ? "rotate-y-0"
              : "rotate-y-180 pointer-events-none opacity-0"
          )}
          onClick={() => setIsFlipped(false)}
        >
          <div className="p-8 flex flex-col items-center justify-center">
            <h3 className="text-xl font-medium text-center mb-4">Answer</h3>
            <h3 className="text-xl text-center">{answer}</h3>
          </div>
        </Card>
      </div>

      {/* Bottom navigation */}
      <div className="flex justify-between items-center px-4 mt-4">
        <Button size="icon" onClick={onPrevious} disabled={currentIndex === 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {totalCards}
        </span>

        <Button
          size="icon"
          onClick={() => {
            setIsFlipped(false);
            onNext();
          }}
          disabled={currentIndex === totalCards - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
