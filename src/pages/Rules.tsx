import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useQuiz } from "@/contexts/QuizContext";
import Layout from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

const rules = [
  "Each question has a specific time limit. Once the timer expires, the quiz auto-advances to the next question.",
  "Do not switch tabs during the quiz. Tab switching will be detected and may affect your attempt.",
  "Do not refresh the page during the quiz. Refreshing will reset your progress.",
  "Once an answer is submitted, it cannot be modified.",
  "A certificate will only be generated if you achieve the minimum passing score (60%).",
  "Any suspicious activity may result in disqualification of the attempt.",
  "The quiz consists of 15 questions with mixed formats: multiple choice, multiple select, true/false, and short answer.",
  "Use the Previous and Next buttons to navigate between questions.",
];

const Rules = () => {
  const { student } = useQuiz();
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  if (!student) return <Navigate to="/" replace />;

  return (
    <Layout>
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Quiz Rules &amp; Regulations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {rules.map((rule, i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>
                {rule}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-start gap-2">
            <Checkbox id="agree" checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} />
            <Label htmlFor="agree" className="text-sm leading-tight">I have read and agree to the rules.</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={!agreed} onClick={() => navigate("/quiz")}>Begin Quiz</Button>
        </CardFooter>
      </Card>
    </Layout>
  );
};

export default Rules;
