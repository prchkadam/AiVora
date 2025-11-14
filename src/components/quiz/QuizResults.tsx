import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Category, Difficulty } from "@/pages/Index";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizResultsProps {
  questions: Question[];
  userAnswers: string[];
  category: Category;
  difficulty: Difficulty;
  onRestart: () => void;
}

const QuizResults = ({
  questions,
  userAnswers,
  category,
  difficulty,
  onRestart,
}: QuizResultsProps) => {
  const [feedback, setFeedback] = useState<string>("");
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);

  const correctCount = questions.filter(
    (q, i) => q.correctAnswer === userAnswers[i]
  ).length;
  const score = Math.round((correctCount / questions.length) * 100);

  useEffect(() => {
    generateFeedback();
  }, []);

  const generateFeedback = async () => {
    setIsLoadingFeedback(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-quiz", {
        body: {
          type: "feedback",
          score,
          category,
          difficulty,
          totalQuestions: questions.length,
          correctAnswers: correctCount,
        },
      });

      if (error) throw error;

      if (data?.feedback) {
        setFeedback(data.feedback);
      }
    } catch (error: any) {
      console.error("Error generating feedback:", error);
      toast.error("Failed to generate feedback");
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const getScoreColor = () => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="p-8 shadow-xl mb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-6 shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Quiz Complete!</h2>
          <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
            {score}%
          </div>
          <p className="text-lg text-muted-foreground">
            You got {correctCount} out of {questions.length} questions correct
          </p>
        </div>

        {isLoadingFeedback ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
            <span className="text-muted-foreground">Generating feedback...</span>
          </div>
        ) : (
          <div className="mb-8 p-6 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
            <h3 className="font-semibold text-lg mb-3">AI Feedback</h3>
            <p className="text-muted-foreground leading-relaxed">{feedback}</p>
          </div>
        )}

        <div className="text-center">
          <Button
            onClick={onRestart}
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary text-white"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Take Another Quiz
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold mb-4">Review Your Answers</h3>
        {questions.map((question, index) => {
          const isCorrect = question.correctAnswer === userAnswers[index];
          return (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  ) : (
                    <XCircle className="w-6 h-6 text-destructive" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-3">
                    Question {index + 1}: {question.question}
                  </h4>
                  <div className="space-y-2 mb-3">
                    <p className="text-sm">
                      <span className="font-medium">Your answer: </span>
                      <span
                        className={
                          isCorrect ? "text-success" : "text-destructive"
                        }
                      >
                        {userAnswers[index]}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm">
                        <span className="font-medium">Correct answer: </span>
                        <span className="text-success">
                          {question.correctAnswer}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="p-3 rounded bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuizResults;
