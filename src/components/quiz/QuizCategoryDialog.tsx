import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Code, Globe, GraduationCap, Music, Rocket } from "lucide-react";
import { useState } from "react";

type Category = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
};

const categories: Category[] = [
  {
    id: "general",
    name: "General Knowledge",
    icon: <Globe className="w-5 h-5" />,
    description: "Test your knowledge across a wide range of topics"
  },
  {
    id: "science",
    name: "Science & Technology",
    icon: <Code className="w-5 h-5" />,
    description: "Explore the world of science and technology"
  },
  {
    id: "history",
    name: "History",
    icon: <GraduationCap className="w-5 h-5" />,
    description: "Journey through historical events and figures"
  },
  {
    id: "arts",
    name: "Arts & Literature",
    icon: <Music className="w-5 h-5" />,
    description: "Discover art, literature, and cultural movements"
  },
  {
    id: "trivia",
    name: "Trivia",
    icon: <Brain className="w-5 h-5" />,
    description: "Fun and challenging trivia questions"
  },
  {
    id: "random",
    name: "Random Mix",
    icon: <Rocket className="w-5 h-5" />,
    description: "A mix of questions from all categories"
  },
];

interface QuizCategoryDialogProps {
  onSelectCategory: (categoryId: string) => void;
  trigger?: React.ReactNode;
}

export function QuizCategoryDialog({ 
  onSelectCategory,
  trigger = <Button>Start New Quiz</Button> 
}: QuizCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const handleStartQuiz = (categoryId: string) => {
    onSelectCategory(categoryId);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose a Quiz Category</DialogTitle>
          <p className="text-muted-foreground">
            Select a category to start your quiz adventure
          </p>
        </DialogHeader>
        
        <Tabs 
          defaultValue="all" 
          className="mt-4"
          onValueChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}
        >
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="easy">Easy</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="hard">Hard</TabsTrigger>
            </TabsList>
            <div className="text-sm text-muted-foreground">
              Selected: <span className="font-medium capitalize">{difficulty}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <div 
                key={category.id}
                className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => handleStartQuiz(category.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
