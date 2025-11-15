import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, CheckCircle2, XCircle, Loader2, ExternalLink, Download } from "lucide-react";
import { toast } from "sonner";
import type { Category, Difficulty } from "@/pages/Index";
import { generateFeedback as generateFeedbackAI } from "@/integrations/ai/gemini";
import { jsPDF } from "jspdf";

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

const formatCategoryLabel = (label: string) =>
  label
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const QuizResults = ({
  questions,
  userAnswers,
  category,
  difficulty,
  onRestart,
}: QuizResultsProps) => {
  const [feedback, setFeedback] = useState<string>("");
  const [learnMore, setLearnMore] = useState<{
    title: string;
    summary: string;
    actionSteps: string[];
  } | null>(null);
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const correctCount = questions.filter(
    (q, i) => q.correctAnswer === userAnswers[i]
  ).length;
  const score = Math.round((correctCount / questions.length) * 100);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    setIsLoadingFeedback(true);
    try {
      const data = await generateFeedbackAI({
        score,
        category,
        difficulty,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
      });
      if (data?.feedback) setFeedback(data.feedback);
      if (data?.learnMore) setLearnMore(data.learnMore);
      setIsLearnMoreOpen(false);
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

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      const doc = new jsPDF();
      const startY = 20;
      let cursorY = startY;

      doc.setFontSize(18);
      doc.text("AiVora Quiz Summary", 14, cursorY);

      doc.setFontSize(12);
      cursorY += 12;
      const summaryLines = [
        `Category: ${formatCategoryLabel(String(category))}`,
        `Difficulty: ${difficulty}`,
        `Score: ${score}% (${correctCount}/${questions.length})`,
      ];
      summaryLines.forEach((line) => {
        doc.text(line, 14, cursorY);
        cursorY += 7;
      });

      cursorY += 4;
      doc.setFont(undefined, "bold");
      doc.text("Questions", 14, cursorY);
      doc.setFont(undefined, "normal");
      cursorY += 8;

      questions.forEach((question, index) => {
        const questionText = `Q${index + 1}: ${question.question}`;
        const questionLines = doc.splitTextToSize(questionText, 180);
        const userAnswerText = `Your answer: ${userAnswers[index] || "(skipped)"}`;
        const correctText = `Correct answer: ${question.correctAnswer}`;

        [...questionLines, userAnswerText, correctText, `Explanation: ${question.explanation}`].forEach((line) => {
          if (cursorY > 270) {
            doc.addPage();
            cursorY = 20;
          }
          doc.text(line, 14, cursorY);
          cursorY += 6;
        });

        cursorY += 4;
      });

      doc.save(`AiVora-Quiz-${Date.now()}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
      toast.error("Could not download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
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
          <div className="mb-8 p-6 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">AI Feedback</h3>
              <p className="text-muted-foreground leading-relaxed">{feedback}</p>
            </div>
            {learnMore && (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => setIsLearnMoreOpen((prev) => !prev)}
                  className="w-full sm:w-auto"
                >
                  {isLearnMoreOpen ? "Hide" : "Show"} learn more suggestions
                </Button>
                {isLearnMoreOpen && (
                  <div className="rounded-xl border border-border/60 bg-background/40 p-5 space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">Learn More</p>
                      <h4 className="text-lg font-semibold">{learnMore.title}</h4>
                      <p className="text-sm text-muted-foreground mt-2">
                        {learnMore.summary}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {learnMore.actionSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm">
                          <ExternalLink className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <p className="text-muted-foreground">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center text-center">
          <Button
            onClick={onRestart}
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary text-white"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Take Another Quiz
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="gap-2"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isDownloading ? "Preparing PDF..." : "Download PDF"}
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
