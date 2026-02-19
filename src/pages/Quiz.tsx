import { useState, useEffect, useCallback } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useQuiz } from "@/contexts/QuizContext";
import { questions } from "@/data/questions";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, ChevronLeft, ChevronRight, Send } from "lucide-react";

const Quiz = () => {
  const { student, answers, setAnswer, completeQuiz, incrementTabSwitch, tabSwitchCount } = useQuiz();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(questions[0].timeLimit);

  const q = questions[current];
  const isLast = current === questions.length - 1;
  const progress = ((current + 1) / questions.length) * 100;

  // Timer
  useEffect(() => {
    setTimeLeft(q.timeLimit);
  }, [current, q.timeLimit]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (isLast) handleSubmit();
      else setCurrent((c) => c + 1);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  // Tab switch detection
  useEffect(() => {
    const handler = () => { if (document.hidden) incrementTabSwitch(); };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [incrementTabSwitch]);

  const handleSubmit = useCallback(() => {
    completeQuiz(questions);
    navigate("/result");
  }, [completeQuiz, navigate]);

  if (!student) return <Navigate to="/" replace />;

  const userAnswer = answers[q.id];

  const renderOptions = () => {
    switch (q.type) {
      case "mcq":
      case "truefalse":
        return (
          <RadioGroup value={typeof userAnswer === "string" ? userAnswer : ""} onValueChange={(v) => setAnswer(q.id, v)} className="space-y-3">
            {q.options?.map((opt) => (
              <label key={opt} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent has-[data-state=checked]:border-primary has-[data-state=checked]:bg-primary/5">
                <RadioGroupItem value={opt} />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </RadioGroup>
        );
      case "multiple": {
        const selected = Array.isArray(userAnswer) ? userAnswer : [];
        return (
          <div className="space-y-3">
            {q.options?.map((opt) => (
              <label key={opt} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent">
                <Checkbox
                  checked={selected.includes(opt)}
                  onCheckedChange={(checked) => {
                    const next = checked ? [...selected, opt] : selected.filter((s) => s !== opt);
                    setAnswer(q.id, next);
                  }}
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        );
      }
      case "short":
        return <Input placeholder="Type your answer here..." value={typeof userAnswer === "string" ? userAnswer : ""} onChange={(e) => setAnswer(q.id, e.target.value)} />;
    }
  };

  return (
    <Layout>
      {tabSwitchCount > 0 && (
        <div className="mb-4 flex w-full max-w-3xl items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Tab switch detected ({tabSwitchCount} time{tabSwitchCount > 1 ? "s" : ""}). Please stay on this tab.
        </div>
      )}

      <div className="grid w-full max-w-3xl gap-6 md:grid-cols-[1fr_240px]">
        {/* Question area */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {/* Mobile timer */}
            <div className="mb-4 flex items-center justify-between md:hidden">
              <Badge variant="secondary">Question {current + 1} of {questions.length}</Badge>
              <div className={`flex items-center gap-1 text-sm font-semibold ${timeLeft <= 5 ? "text-destructive" : "text-foreground"}`}>
                <Clock className="h-4 w-4" /> {timeLeft}s
              </div>
            </div>

            <p className="mb-1 hidden text-sm text-muted-foreground md:block">Question {current + 1} of {questions.length}</p>
            <h2 className="mb-6 text-lg font-semibold">{q.question}</h2>

            {renderOptions()}

            <div className="mt-6 flex justify-between gap-2">
              <Button variant="outline" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              {isLast ? (
                <Button onClick={handleSubmit}><Send className="h-4 w-4" /> Submit</Button>
              ) : (
                <Button onClick={() => setCurrent((c) => c + 1)}>Next <ChevronRight className="h-4 w-4" /></Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar — desktop only */}
        <div className="hidden space-y-4 md:block">
          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <p className="mb-1 text-xs text-muted-foreground">Time Remaining</p>
              <div className={`text-3xl font-bold ${timeLeft <= 5 ? "text-destructive" : "text-primary"}`}>{timeLeft}s</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <p className="mb-2 text-xs text-muted-foreground">Progress</p>
              <Progress value={progress} className="mb-1" />
              <p className="text-right text-xs text-muted-foreground">{Math.round(progress)}%</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Quiz;
