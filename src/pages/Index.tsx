import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Brain, Trophy } from "lucide-react";
import CategorySelection from "@/components/quiz/CategorySelection";
import DifficultySelection from "@/components/quiz/DifficultySelection";
import QuizGame from "@/components/quiz/QuizGame";
import { NavBar } from "@/components/NavBar";

export type Category =
  | "science"
  | "history"
  | "geography"
  | "sports"
  | "general"
  | "technology"
  | "space-astronomy"
  | "arts-creativity"
  | "logic-brain-games"
  | "business"
  | "health"
  | "literature"
  | "philosophy"
  | "environment"
  | "politics"
  | "food"
  | "cinema"
  | "mythology"
  | "psychity"
  | string; // custom category

export type Difficulty = "easy" | "medium" | "hard";

const Index = () => {
  const [step, setStep] = useState<"welcome" | "category" | "difficulty" | "count" | "quiz">("welcome");
  const [category, setCategory] = useState<Category | null>(null);
  const [customCategory, setCustomCategory] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [questionCount, setQuestionCount] = useState(8);

  const handleCategorySelect = (selectedCategory: Category) => {
    setCategory(selectedCategory);
    setStep("difficulty");
  };

  const handleCustomCategorySubmit = () => {
    const trimmed = customCategory.trim();
    if (trimmed) {
      setCategory(trimmed);
      setStep("difficulty");
    }
  };

  const handleNavCategoryChange = (selectedCategory: Category) => {
    setCategory(selectedCategory);
    setStep("difficulty");
  };

  const handleCreateQuiz = () => {
    setStep("category");
  };

  const handleDifficultySelect = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setStep("count");
  };

  const handleCountSelect = () => {
    setStep("quiz");
  };

  const handleRestart = () => {
    setCategory(null);
    setDifficulty(null);
    setQuestionCount(8);
    setStep("welcome");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <NavBar
        onCategoryChange={handleNavCategoryChange}
        selectedCategory={category ?? undefined}
      />
      <div className="container mx-auto px-4 py-8 md:py-12">
        {step === "welcome" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-6 shadow-lg">
                <Brain className="w-10 h-10 text-primary-foreground" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">
                AiVora
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Test your knowledge with AI-generated questions tailored to your preferences
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Choose Your Topic</h3>
                <p className="text-sm text-muted-foreground">
                  Select from various categories to focus on what interests you
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 mb-4">
                  <Brain className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">AI-Powered</h3>
                <p className="text-sm text-muted-foreground">
                  Questions generated intelligently to match your skill level
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4">
                  <Trophy className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant feedback and detailed results after each quiz
                </p>
              </Card>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                onClick={() => setStep("category")}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Quiz
              </Button>
            </div>
          </div>
        )}

        {step === "category" && (
          <CategorySelection onSelect={handleCategorySelect} />
        )}

        {step === "difficulty" && category && (
          <DifficultySelection onSelect={handleDifficultySelect} />
        )}

        {step === "count" && category && difficulty && (
          <div className="max-w-md mx-auto">
            <Card className="p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-center">Number of Questions</h2>
              <div className="flex items-center justify-center gap-4 mb-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuestionCount((c) => Math.max(1, c - 1))}
                  disabled={questionCount <= 1}
                >
                  −
                </Button>
                <span className="text-3xl font-semibold min-w-[3ch] text-center">{questionCount}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuestionCount((c) => Math.min(20, c + 1))}
                  disabled={questionCount >= 20}
                >
                  +
                </Button>
              </div>
              <div className="flex gap-4">
                <Button variant="secondary" onClick={() => setStep("difficulty")} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleCountSelect} className="flex-1 bg-gradient-to-r from-primary to-secondary text-white">
                  Start Quiz
                </Button>
              </div>
            </Card>
          </div>
        )}

        {step === "quiz" && category && difficulty && (
          <QuizGame
            category={category}
            difficulty={difficulty}
            questionCount={questionCount}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
