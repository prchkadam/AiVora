import { Card } from "@/components/ui/card";
import { Smile, Zap, Flame } from "lucide-react";
import type { Difficulty } from "@/pages/Index";

interface DifficultySelectionProps {
  onSelect: (difficulty: Difficulty) => void;
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

const DifficultySelection = ({ onSelect }: DifficultySelectionProps) => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-3">Select Difficulty</h2>
        <p className="text-lg text-muted-foreground">
          How challenging do you want the quiz to be?
        </p>
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
