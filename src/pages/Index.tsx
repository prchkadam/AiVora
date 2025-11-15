import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Brain, Trophy, Zap, Target, Users, CheckCircle, Sparkles, Star, Hexagon, Circle } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/40 to-background relative overflow-hidden">
      {/* Decorative static elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-16 w-[380px] h-[380px] bg-gradient-to-br from-primary/25 to-secondary/20 blur-[140px]" />
        <div className="absolute -bottom-24 -left-10 w-[420px] h-[420px] bg-gradient-to-br from-secondary/25 via-primary/15 to-accent/20 blur-[150px]" />
        <div className="absolute top-1/3 left-8 w-28 h-28 border border-primary/20 rounded-full opacity-70" />
        <div className="absolute bottom-1/4 right-16 w-32 h-32 border border-secondary/15 rounded-full opacity-60" />
        <div className="absolute top-16 right-1/3 w-16 h-16 border border-accent/20 rotate-12 opacity-70" />
        <div className="absolute bottom-10 left-1/2 w-16 h-16 border border-primary/15 -rotate-6 opacity-60" />
        <Sparkles className="absolute top-12 left-12 w-6 h-6 text-primary/20" />
        <Sparkles className="absolute bottom-1/3 right-12 w-5 h-5 text-secondary/20" />
        <Star className="absolute top-1/3 left-1/4 w-7 h-7 text-accent/15" />
        <Hexagon className="absolute bottom-12 right-1/3 w-9 h-9 text-primary/15" />
        <Circle className="absolute top-1/2 right-1/4 w-12 h-12 text-primary/10" />
        <Circle className="absolute top-2/3 left-1/2 w-11 h-11 text-secondary/10" />
      </div>
      <NavBar
        onCategoryChange={handleNavCategoryChange}
        selectedCategory={category ?? undefined}
      />
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
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

            {/* How It Works */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary/10 to-primary/20">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="font-semibold">Pick a Category</h4>
                  <p className="text-sm text-muted-foreground">Choose from 20+ topics or create your own.</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-secondary/10 to-secondary/20">
                    <Zap className="w-7 h-7 text-secondary" />
                  </div>
                  <h4 className="font-semibold">Set Difficulty</h4>
                  <p className="text-sm text-muted-foreground">Easy, medium, or hard—tailored to you.</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-accent/10 to-accent/20">
                    <Brain className="w-7 h-7 text-accent" />
                  </div>
                  <h4 className="font-semibold">AI Generates</h4>
                  <p className="text-sm text-muted-foreground">Fresh, relevant questions on the fly.</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary/10 to-primary/20">
                    <Trophy className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="font-semibold">Get Feedback</h4>
                  <p className="text-sm text-muted-foreground">Instant results and personalized tips.</p>
                </div>
              </div>
            </div>

            {/* Sample Topics Highlight */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-center mb-8">Explore Topics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: "🔬", label: "Science" },
                  { icon: "💻", label: "Technology" },
                  { icon: "🚀", label: "Space" },
                  { icon: "🎨", label: "Arts" },
                  { icon: "🧠", label: "Logic Games" },
                  { icon: "💼", label: "Business" },
                  { icon: "🌍", label: "Environment" },
                  { icon: "🍽️", label: "Food" },
                ].map((topic, i) => (
                  <Card
                    key={i}
                    className="p-4 text-center hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={() => setStep("category")}
                  >
                    <div className="text-2xl mb-2">{topic.icon}</div>
                    <p className="text-sm font-medium">{topic.label}</p>
                  </Card>
                ))}
              </div>
            </div>

            {/* Feature List */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-center mb-8">Why AiVora?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Adaptive AI</h4>
                    <p className="text-sm text-muted-foreground">Questions adapt to your selected difficulty and interests.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Instant Explanations</h4>
                    <p className="text-sm text-muted-foreground">Every answer includes a concise explanation to help you learn.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Custom Topics</h4>
                    <p className="text-sm text-muted-foreground">Create your own category and quiz on anything you like.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Personalized Feedback</h4>
                    <p className="text-sm text-muted-foreground">Get AI-generated feedback and actionable tips after each quiz.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-20 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Join learners sharpening their knowledge every day</span>
              </div>
            </div>

            {/* End Section */}
            <div className="mt-24 border border-white/10 rounded-3xl bg-background/40 backdrop-blur p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="space-y-3 text-center md:text-left max-w-2xl">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Stay curious</p>
                <h3 className="text-3xl font-semibold">Keep exploring new ideas with AiVora</h3>
                <p className="text-sm text-muted-foreground">
                  Whether you’re brushing up for interviews, prepping for exams, or just feeding your curiosity,
                  the best way to improve is to quiz yourself consistently. Come back tomorrow for a fresh challenge.
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => setStep("category")}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started
              </Button>
            </div>
          </div>
        )}

        {step === "category" && (
          <CategorySelection onSelect={handleCategorySelect} />
        )}

        {step === "difficulty" && category && (
          <DifficultySelection
            onSelect={handleDifficultySelect}
            onBack={() => setStep("category")}
          />
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
