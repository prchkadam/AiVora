import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FlaskConical,
  Landmark,
  Globe,
  Trophy,
  Lightbulb,
  Code,
  Rocket,
  Palette,
  Brain,
  Briefcase,
  Heart,
  BookOpen,
  Scale,
  Leaf,
  Building,
  Utensils,
  Film,
  Scroll,
  User,
  Plus,
} from "lucide-react";
import type { Category } from "@/pages/Index";
import { useState } from "react";

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
  {
    id: "technology" as Category,
    name: "Technology",
    icon: Code,
    description: "Programming, languages, cybersecurity",
    color: "from-indigo-500 to-blue-500",
  },
  {
    id: "space-astronomy" as Category,
    name: "Space & Astronomy",
    icon: Rocket,
    description: "Astrophysics, planetary science, space tech",
    color: "from-slate-700 to-slate-900",
  },
  {
    id: "arts-creativity" as Category,
    name: "Arts & Creativity",
    icon: Palette,
    description: "Music theory, dance, art & artists",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "logic-brain-games" as Category,
    name: "Logic & Brain Games",
    icon: Brain,
    description: "Riddles, aptitude, IQ tests",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "business" as Category,
    name: "Business",
    icon: Briefcase,
    description: "Companies, entrepreneurship, economics",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "health" as Category,
    name: "Health",
    icon: Heart,
    description: "Medicine, wellness, human body",
    color: "from-rose-500 to-pink-500",
  },
  {
    id: "literature" as Category,
    name: "Literature",
    icon: BookOpen,
    description: "Authors, novels, poetry, plays",
    color: "from-amber-600 to-yellow-500",
  },
  {
    id: "philosophy" as Category,
    name: "Philosophy",
    icon: Scale,
    description: "Ethics, metaphysics, great thinkers",
    color: "from-stone-500 to-slate-600",
  },
  {
    id: "environment" as Category,
    name: "Environment",
    icon: Leaf,
    description: "Climate, ecology, conservation",
    color: "from-green-600 to-emerald-600",
  },
  {
    id: "politics" as Category,
    name: "Politics",
    icon: Building,
    description: "Governments, policies, political theory",
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: "food" as Category,
    name: "Food & Cuisine",
    icon: Utensils,
    description: "Cooking, ingredients, world cuisines",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "cinema" as Category,
    name: "Cinema",
    icon: Film,
    description: "Movies, directors, film history",
    color: "from-purple-600 to-indigo-600",
  },
  {
    id: "mythology" as Category,
    name: "Mythology",
    icon: Scroll,
    description: "Gods, legends, ancient myths",
    color: "from-yellow-600 to-amber-700",
  },
  {
    id: "psychology" as Category,
    name: "Psychology",
    icon: User,
    description: "Mind, behavior, mental processes",
    color: "from-cyan-500 to-blue-500",
  },
];

const CategorySelection = ({ onSelect }: CategorySelectionProps) => {
  const [customInput, setCustomInput] = useState("");

  const handleCustomSubmit = () => {
    const trimmed = customInput.trim();
    if (trimmed) {
      onSelect(trimmed);
    }
  };
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

        {/* Create your own category card */}
        <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-600 mb-4 group-hover:scale-110 transition-transform duration-300">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            Create Your Own Category
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Type any topic you want to be quizzed on
          </p>
          <div className="space-y-2">
            <Input
              placeholder="e.g. Artificial Intelligence"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
            />
            <Button
              onClick={handleCustomSubmit}
              disabled={!customInput.trim()}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white"
            >
              Start Quiz
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CategorySelection;
