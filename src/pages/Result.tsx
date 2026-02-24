import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuiz } from "@/contexts/QuizContext";
import { PASSING_MARKS_PERCENTAGE } from "@/data/questions";

import Layout from "@/components/Layout";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Award,
  RotateCcw,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Result = () => {
  const {
    student,
    score,
    totalQuestions,
    quizCompleted,
    resetQuiz,
    questions,
    answers,
  } = useQuiz();

  const navigate = useNavigate();
  const [expandReview, setExpandReview] = useState(false);

  /* SAFETY GUARD */
  if (!student || !quizCompleted)
    return <Navigate to="/" replace />;

  /* CALCULATIONS */
  const percentage =
    totalQuestions > 0
      ? Math.round((score / totalQuestions) * 100)
      : 0;

  const passed =
    percentage >= PASSING_MARKS_PERCENTAGE;

  /* ANSWER CHECKER */
  const isAnswerCorrect = (
    correctAnswer: any,
    userAnswer: any
  ) => {
    if (!userAnswer) return false;

    if (
      Array.isArray(correctAnswer) &&
      Array.isArray(userAnswer)
    ) {
      if (
        correctAnswer.length !==
        userAnswer.length
      )
        return false;

      return correctAnswer.every((a) =>
        userAnswer.includes(a)
      );
    }

    return (
      String(userAnswer)
        .trim()
        .toLowerCase() ===
      String(correctAnswer)
        .trim()
        .toLowerCase()
    );
  };

  return (
    <Layout>
      <div className="w-full max-w-2xl space-y-6">

        <Card className="text-center shadow-lg">
          <CardHeader>
            <div
              className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full"
              style={{
                backgroundColor: passed
                  ? "hsl(142 71% 35% / 0.1)"
                  : "hsl(0 72% 51% / 0.1)",
              }}
            >
              {passed ? (
                <CheckCircle
                  className="h-8 w-8"
                  style={{
                    color:
                      "hsl(142 71% 35%)",
                  }}
                />
              ) : (
                <XCircle className="h-8 w-8 text-destructive" />
              )}
            </div>

            <CardTitle className="text-2xl">
              Quiz Completed
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {student.fullName}
            </p>

            <div className="text-4xl font-bold text-primary">
              {score} / {totalQuestions}
            </div>

            <p className="text-sm text-muted-foreground">
              {percentage}% score
            </p>

            <Badge
              className="text-sm"
              style={{
                backgroundColor: passed
                  ? "hsl(142 71% 35%)"
                  : "hsl(0 72% 51%)",
                color: "white",
              }}
            >
              {passed ? "PASSED" : "FAILED"}
            </Badge>

            {!passed && (
              <p className="text-sm text-muted-foreground">
                Passing score required:{" "}
                {PASSING_MARKS_PERCENTAGE}%
              </p>
            )}
          </CardContent>

          <CardFooter className="flex-col gap-2">
            {passed ? (
              <Button
                className="w-full"
                onClick={() =>
                  navigate("/certificate")
                }
              >
                <Award className="h-4 w-4 mr-2" />
                Download Certificate
              </Button>
            ) : (
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  resetQuiz();
                  navigate("/quiz");
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* REVIEW SECTION */}
        <Card className="shadow-lg">
          <CardHeader>
            <button
              onClick={() =>
                setExpandReview(
                  !expandReview
                )
              }
              className="flex w-full items-center justify-between"
            >
              <CardTitle className="text-base">
                Review Answers
              </CardTitle>
              {expandReview ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </CardHeader>

          {expandReview && (
            <CardContent>
              <Accordion
                type="single"
                collapsible
                className="w-full"
              >
                {question.map((q, idx) => {
                  const userAnswer =
                    answers[q.id];

                  const correct =
                    isAnswerCorrect(
                      q.correctAnswer,
                      userAnswer
                    );

                  return (
                    <AccordionItem
                      key={q.id}
                      value={`q-${q.id}`}
                    >
                      <AccordionTrigger>
                        <div className="flex items-center gap-3 text-left">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                              correct
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {idx + 1}
                          </div>

                          <div>
                            <div className="text-sm font-medium">
                              {q.question}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {correct
                                ? "✓ Correct"
                                : "✗ Incorrect"}
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="pt-4 space-y-3">
                        {userAnswer && (
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground">
                              Your Answer
                            </p>
                            <p className="text-sm">
                              {Array.isArray(userAnswer)
                                ? userAnswer.join(", ")
                                : userAnswer}
                            </p>
                          </div>
                        )}

                        <div>
                          <p className="text-xs font-semibold text-muted-foreground">
                            Correct Answer
                          </p>
                          <p className="text-sm">
                            {Array.isArray(
                              q.correctAnswer
                            )
                              ? q.correctAnswer.join(
                                  ", "
                                )
                              : q.correctAnswer}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default Result;