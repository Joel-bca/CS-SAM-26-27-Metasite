import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "quiz_state";

export interface StudentInfo {
  fullName: string;
  regNumber: string;
  department: string;
  email: string;
}

export interface Question {
  id: string;
  type: "mcq" | "multiple" | "truefalse" | "short";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  timeLimit: number;
}

interface QuizState {
  student: StudentInfo | null;
  answers: Record<string, string | string[]>;
  score: number;
  totalQuestions: number;
  quizCompleted: boolean;
  tabSwitchCount: number;
  currentQuestion: number;
}

interface QuizContextType extends QuizState {
  setStudent: (info: StudentInfo) => void;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  setCurrentQuestion: (index: number) => void;
  completeQuiz: (questions: Question[]) => void;
  resetQuiz: () => void;
  incrementTabSwitch: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [state, setState] = useState<QuizState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : {
          student: null,
          answers: {},
          score: 0,
          totalQuestions: 0,
          quizCompleted: false,
          tabSwitchCount: 0,
          currentQuestion: 0,
        };
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setStudent = useCallback((info: StudentInfo) => {
    setState((prev) => ({ ...prev, student: info }));
  }, []);

  const setAnswer = useCallback((questionId: string, answer: string | string[]) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer },
    }));
  }, []);

  const setCurrentQuestion = useCallback((index: number) => {
    setState((prev) => ({ ...prev, currentQuestion: index }));
  }, []);

  const completeQuiz = useCallback((questions: Question[]) => {
    setState((prev) => {
      let score = 0;

      questions.forEach((q) => {
        const userAnswer = prev.answers[q.id];
        if (!userAnswer) return;

        if (Array.isArray(q.correctAnswer)) {
          if (
            Array.isArray(userAnswer) &&
            q.correctAnswer.length === userAnswer.length &&
            q.correctAnswer.every((a) => userAnswer.includes(a))
          ) {
            score++;
          }
        } else {
          const normalizedUser =
            typeof userAnswer === "string"
              ? userAnswer.trim().toLowerCase()
              : "";

          if (
            normalizedUser ===
            String(q.correctAnswer).trim().toLowerCase()
          ) {
            score++;
          }
        }
      });

      return {
        ...prev,
        score,
        totalQuestions: questions.length,
        quizCompleted: true,
      };
    });
  }, []);

  const resetQuiz = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      student: null,
      answers: {},
      score: 0,
      totalQuestions: 0,
      quizCompleted: false,
      tabSwitchCount: 0,
      currentQuestion: 0,
    });
  }, []);

  const incrementTabSwitch = useCallback(() => {
    setState((prev) => ({
      ...prev,
      tabSwitchCount: prev.tabSwitchCount + 1,
    }));
  }, []);

  return (
    <QuizContext.Provider
      value={{
        ...state,
        setStudent,
        setAnswer,
        setCurrentQuestion,
        completeQuiz,
        resetQuiz,
        incrementTabSwitch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
};