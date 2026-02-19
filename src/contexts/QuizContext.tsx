import React, { createContext, useContext, useState, useCallback } from "react";

export interface StudentInfo {
  fullName: string;
  regNumber: string;
  department: string;
}

export interface Question {
  id: number;
  type: "mcq" | "multiple" | "truefalse" | "short";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  timeLimit: number; // seconds
}

interface QuizState {
  student: StudentInfo | null;
  answers: Record<number, string | string[]>;
  score: number;
  totalQuestions: number;
  quizCompleted: boolean;
  tabSwitchCount: number;
}

interface QuizContextType extends QuizState {
  setStudent: (info: StudentInfo) => void;
  setAnswer: (questionId: number, answer: string | string[]) => void;
  completeQuiz: (questions: Question[]) => void;
  resetQuiz: () => void;
  incrementTabSwitch: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<QuizState>({
    student: null,
    answers: {},
    score: 0,
    totalQuestions: 0,
    quizCompleted: false,
    tabSwitchCount: 0,
  });

  const setStudent = useCallback((info: StudentInfo) => {
    setState((prev) => ({ ...prev, student: info }));
  }, []);

  const setAnswer = useCallback((questionId: number, answer: string | string[]) => {
    setState((prev) => ({ ...prev, answers: { ...prev.answers, [questionId]: answer } }));
  }, []);

  const completeQuiz = useCallback((questions: Question[]) => {
    setState((prev) => {
      let score = 0;
      questions.forEach((q) => {
        const userAnswer = prev.answers[q.id];
        if (!userAnswer) return;
        if (Array.isArray(q.correctAnswer)) {
          if (Array.isArray(userAnswer) && q.correctAnswer.length === userAnswer.length && q.correctAnswer.every((a) => userAnswer.includes(a))) {
            score++;
          }
        } else {
          const normalizedUser = typeof userAnswer === "string" ? userAnswer.trim().toLowerCase() : "";
          if (normalizedUser === String(q.correctAnswer).trim().toLowerCase()) {
            score++;
          }
        }
      });
      return { ...prev, score, totalQuestions: questions.length, quizCompleted: true };
    });
  }, []);

  const resetQuiz = useCallback(() => {
    setState((prev) => ({
      ...prev,
      answers: {},
      score: 0,
      totalQuestions: 0,
      quizCompleted: false,
      tabSwitchCount: 0,
    }));
  }, []);

  const incrementTabSwitch = useCallback(() => {
    setState((prev) => ({ ...prev, tabSwitchCount: prev.tabSwitchCount + 1 }));
  }, []);

  return (
    <QuizContext.Provider value={{ ...state, setStudent, setAnswer, completeQuiz, resetQuiz, incrementTabSwitch }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
};
