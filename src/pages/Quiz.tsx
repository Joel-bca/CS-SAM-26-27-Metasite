import { useState, useEffect, useCallback } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useQuiz } from "@/contexts/QuizContext";
import { getQuestions } from "@/utils/csvParser";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {      
  Clock,
  AlertTriangle,
  ChevronLeft,  
  ChevronRight,
  Send,
  AlertCircle,
  Loader,
} from "lucide-react";

const Quiz = () => {
  const {
    student,
    answers,
    setAnswer,
    completeQuiz,
    incrementTabSwitch,
    tabSwitchCount,
    questions,
    loading,
    error,
    loadQuestions,
    setLoading,
    setError,
    currentQuestion,
    setCurrentQuestion,
  } = useQuiz();

  const navigate = useNavigate();
  const current = currentQuestion;
  const [timeLeft, setTimeLeft] = useState(0);

  /* =========================
     LOAD QUESTIONS
  ========================= */

  useEffect(() => {
    if (questions.length === 0) {
      setLoading(true);

      getQuestions()
        .then((loadedQuestions) => {
          loadQuestions(loadedQuestions);
          setLoading(false);
          setError(null);
        })
        .catch((err) => {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load questions"
          );
          setLoading(false);
        });
    }
  }, [questions.length]);

  /* =========================
     TIMER INIT
  ========================= */

  useEffect(() => {
    if (questions.length > 0) {
      setTimeLeft(
        questions[current]?.timeLimit || 30
      );
    }
  }, [questions, current]);

  /* =========================
     TIMER COUNTDOWN
  ========================= */

  useEffect(() => {
    if (!questions.length) return;

    if (timeLeft <= 0) {
      if (current === questions.length - 1) {
        handleSubmit();
      } else {
        setCurrentQuestion(current + 1);
      }
      return;
    }

    const timer = setTimeout(
      () => setTimeLeft((t) => t - 1),
      1000
    );

    return () => clearTimeout(timer);
  }, [timeLeft]);

  /* =========================
     TAB SWITCH DETECTION
  ========================= */

  useEffect(() => {
    const handler = () => {
      if (document.hidden) {
        incrementTabSwitch();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handler
    );

    return () =>
      document.removeEventListener(
        "visibilitychange",
        handler
      );
  }, [incrementTabSwitch]);

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = useCallback(() => {
    completeQuiz(questions);
    navigate("/result");
  }, [completeQuiz, navigate, questions]);

  /* =========================
     GUARDS
  ========================= */

  if (!student)
    return <Navigate to="/" replace />;

  if (loading) {
    return (
      <Layout>
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="flex flex-col items-center justify-center space-y-4 p-8">
            <Loader className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">
              Loading quiz questions...
            </p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Card className="w-full max-w-md shadow-lg border-destructive/30">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span className="font-semibold">
                Error Loading Quiz
              </span>
            </div>

            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {error}
            </p>

            <Button
              onClick={() => {
                setError(null);
                setLoading(true);

                getQuestions()
                  .then((loadedQuestions) => {
                    loadQuestions(
                      loadedQuestions
                    );
                    setLoading(false);
                  })
                  .catch((err) => {
                    setError(
                      err instanceof Error
                        ? err.message
                        : "Failed to load questions"
                    );
                    setLoading(false);
                  });
              }}
              className="w-full"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  if (questions.length === 0) {
    return (
      <Layout>
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-6 text-center">
            <p className="font-semibold">
              No questions available
            </p>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  /* =========================
     RENDER
  ========================= */

  const q = questions[current];
  const isLast = current === questions.length - 1;
  const progress =
    ((current + 1) / questions.length) * 100;

  const userAnswer = answers[q.id];

  const renderOptions = () => {
    switch (q.type) {
      case "mcq":
      case "truefalse":
        return (
          <RadioGroup
            value={
              typeof userAnswer === "string"
                ? userAnswer
                : ""
            }
            onValueChange={(v) =>
              setAnswer(q.id, v)
            }
            className="space-y-3"
          >
            {q.options?.map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-accent"
              >
                <RadioGroupItem value={opt} />
                <span className="text-sm">
                  {opt}
                </span>
              </label>
            ))}
          </RadioGroup>
        );

      case "multiple": {
        const selected = Array.isArray(
          userAnswer
        )
          ? userAnswer
          : [];

        return (
          <div className="space-y-3">
            {q.options?.map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-accent"
              >
                <Checkbox
                  checked={selected.includes(opt)}
                  onCheckedChange={(
                    checked
                  ) => {
                    const next = checked
                      ? [...selected, opt]
                      : selected.filter(
                          (s) =>
                            s !== opt
                        );
                    setAnswer(q.id, next);
                  }}
                />
                <span className="text-sm">
                  {opt}
                </span>
              </label>
            ))}
          </div>
        );
      }

      case "short":
        return (
          <Input
            placeholder="Type your answer..."
            value={
              typeof userAnswer === "string"
                ? userAnswer
                : ""
            }
            onChange={(e) =>
              setAnswer(
                q.id,
                e.target.value
              )
            }
          />
        );
    }
  };

  return (
    <Layout>
      {tabSwitchCount > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          Tab switch detected (
          {tabSwitchCount})
        </div>
      )}

      <div className="grid w-full max-w-3xl gap-6 md:grid-cols-[1fr_240px]">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <Badge variant="secondary">
              Question {current + 1} of{" "}
              {questions.length}
            </Badge>

            <h2 className="my-6 text-lg font-semibold">
              {q.question}
            </h2>

            {renderOptions()}

            <div className="mt-6 flex justify-between gap-2">
              <Button
                variant="outline"
                disabled={current === 0}
                onClick={() =>
                  setCurrentQuestion(
                    current - 1
                  )
                }
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {isLast ? (
                <Button
                  onClick={handleSubmit}
                >
                  <Send className="h-4 w-4" />
                  Submit
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    setCurrentQuestion(
                      current + 1
                    )
                  }
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="hidden space-y-4 md:block">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground">
                Time Remaining
              </p>
              <div className="text-3xl font-bold">
                {timeLeft}s
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <Progress value={progress} />
              <p className="text-right text-xs text-muted-foreground mt-1">
                {Math.round(progress)}%
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Quiz;