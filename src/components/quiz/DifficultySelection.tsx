import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Zap, Flame, ArrowLeft } from "lucide-react";
import type { Difficulty } from "@/pages/Index";

interface DifficultySelectionProps {
  onSelect: (difficulty: Difficulty) => void;
  onBack?: () => void;
}

const difficulties = [
  {
    id: "easy" as Difficulty,
    name: "Easy",
    icon: Smile,
    description: "Perfect for beginners",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "medium" as Difficulty,
    name: "Medium",
    icon: Zap,
    description: "A balanced challenge",
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "hard" as Difficulty,
    name: "Hard",
    icon: Flame,
    description: "For quiz masters",
    color: "from-red-500 to-rose-500",
  },
];

const DifficultySelection = ({ onSelect, onBack }: DifficultySelectionProps) => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pt-12">
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          <div className="text-center flex-1">
            <h2 className="text-4xl font-bold mb-3">Select Difficulty</h2>
            <p className="text-lg text-muted-foreground">
              How challenging do you want the quiz to be?
            </p>
          </div>
          {/* Empty div to balance the flex layout */}
          <div className="w-24"></div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {difficulties.map((difficulty, index) => {
          const Icon = difficulty.icon;
          return (
            <Card
              key={difficulty.id}
              onClick={() => onSelect(difficulty.id)}
              className="p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "backwards",
              }}
            >
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${difficulty.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {difficulty.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {difficulty.description}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DifficultySelection;
