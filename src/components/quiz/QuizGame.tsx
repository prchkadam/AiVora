import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Category, Difficulty } from "@/pages/Index";
import QuizResults from "./QuizResults";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizGameProps {
  category: Category;
  difficulty: Difficulty;
  onRestart: () => void;
}

const QuizGame = ({ category, difficulty, onRestart }: QuizGameProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, [category, difficulty]);

  const generateQuestions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-quiz", {
        body: { category, difficulty },
      });

      if (error) throw error;

      if (data?.questions) {
        setQuestions(data.questions);
      }
    } catch (error: any) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate quiz questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    setUserAnswers([...userAnswers, selectedAnswer]);
    setIsAnswered(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer) {
      toast.error("Please select an answer");
      return;
    }
    setIsAnswered(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Generating your quiz...</p>
      </div>
    );
  }

  if (showResults) {
    return (
      <QuizResults
        questions={questions}
        userAnswers={[...userAnswers, selectedAnswer || ""]}
        category={category}
        difficulty={difficulty}
        onRestart={onRestart}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="p-8 shadow-xl">
        <h3 className="text-2xl font-bold mb-8">{currentQuestion.question}</h3>

        <div className="space-y-4 mb-8">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.correctAnswer;
            const showCorrectAnswer = isAnswered && isCorrect;
            const showWrongAnswer = isAnswered && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                  showCorrectAnswer
                    ? "border-success bg-success/10"
                    : showWrongAnswer
                    ? "border-destructive bg-destructive/10"
                    : isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                } ${isAnswered ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                <span className="font-medium">{option}</span>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border animate-in fade-in slide-in-from-bottom-2">
            <p className="font-semibold mb-2">Explanation:</p>
            <p className="text-sm text-muted-foreground">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        <div className="flex justify-end">
          {!isAnswered ? (
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="bg-gradient-to-r from-primary to-secondary text-white"
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-primary to-secondary text-white"
            >
              {currentQuestionIndex < questions.length - 1
                ? "Next Question"
                : "See Results"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QuizGame;
