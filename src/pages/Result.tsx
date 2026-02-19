import { Navigate, useNavigate } from "react-router-dom";
import { useQuiz } from "@/contexts/QuizContext";
import { PASSING_PERCENTAGE } from "@/data/questions";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, RotateCcw, CheckCircle, XCircle } from "lucide-react";

const Result = () => {
  const { student, score, totalQuestions, quizCompleted, resetQuiz } = useQuiz();
  const navigate = useNavigate();

  if (!student || !quizCompleted) return <Navigate to="/" replace />;

  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= PASSING_PERCENTAGE;

  return (
    <Layout>
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: passed ? "hsl(142 71% 35% / 0.1)" : "hsl(0 72% 51% / 0.1)" }}>
            {passed ? <CheckCircle className="h-8 w-8" style={{ color: "hsl(142 71% 35%)" }} /> : <XCircle className="h-8 w-8 text-destructive" />}
          </div>
          <CardTitle className="text-2xl">Quiz Completed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{student.fullName}</p>
          <div className="text-4xl font-bold text-primary">{score} / {totalQuestions}</div>
          <p className="text-sm text-muted-foreground">{percentage}% score</p>
          <Badge className="text-sm" style={{
            backgroundColor: passed ? "hsl(142 71% 35%)" : "hsl(0 72% 51%)",
            color: "white",
          }}>
            {passed ? "PASSED" : "FAILED"}
          </Badge>
          {!passed && <p className="text-sm text-muted-foreground">You did not reach the qualifying score of {PASSING_PERCENTAGE}%.</p>}
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {passed ? (
            <Button className="w-full" onClick={() => navigate("/certificate")}><Award className="h-4 w-4" /> Download Certificate</Button>
          ) : (
            <Button className="w-full" variant="outline" onClick={() => { resetQuiz(); navigate("/quiz"); }}><RotateCcw className="h-4 w-4" /> Retake Quiz</Button>
          )}
        </CardFooter>
      </Card>
    </Layout>
  );
};

export default Result;
