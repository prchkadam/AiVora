import { Card } from "@/components/ui/card";
import { FlaskConical, Landmark, Globe, Trophy, Lightbulb } from "lucide-react";
import type { Category } from "@/pages/Index";

interface CategorySelectionProps {
  onSelect: (category: Category) => void;
}

const categories = [
  {
    id: "science" as Category,
    name: "Science",
    icon: FlaskConical,
    description: "Biology, Chemistry, Physics",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "history" as Category,
    name: "History",
    icon: Landmark,
    description: "World events and civilizations",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "geography" as Category,
    name: "Geography",
    icon: Globe,
    description: "Countries, capitals, landmarks",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "sports" as Category,
    name: "Sports",
    icon: Trophy,
    description: "Athletes, teams, championships",
    color: "from-red-500 to-rose-500",
  },
  {
    id: "general" as Category,
    name: "General Knowledge",
    icon: Lightbulb,
    description: "Mixed topics and trivia",
    color: "from-purple-500 to-pink-500",
  },
];

const CategorySelection = ({ onSelect }: CategorySelectionProps) => {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-3">Choose Your Category</h2>
        <p className="text-lg text-muted-foreground">
          Select a topic you'd like to be quizzed on
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <Card
              key={category.id}
              onClick={() => onSelect(category.id)}
              className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "backwards",
              }}
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelection;
