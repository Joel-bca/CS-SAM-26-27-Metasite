import React from 'react';
import { motion } from 'framer-motion';
import QuizTopBar from './QuizTopBar';
import TimerCircle from './TimerCircle';
import QuestionSection from './QuestionSection';
import NavigationBar from './NavigationBar';

const QuizQuestionScreen = ({
  voterName,
  currentQuestionIndex,
  quizQuestions,
  answers,
  timeLeft,
  handleAnswerChange,
  moveToNextQuestion,
  handleSubmit
}) => {
  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <motion.div
      className="quiz-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <QuizTopBar
        voterName={voterName}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={quizQuestions.length}
        answers={answers}
      />
      <div className="quiz-full-container">
        <motion.div
          className="quiz-content-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          key={currentQuestionIndex}
        >
          <TimerCircle timeLeft={timeLeft} />
          <QuestionSection
            currentQuestion={currentQuestion}
            answers={answers}
            currentQuestionIndex={currentQuestionIndex}
            handleAnswerChange={handleAnswerChange}
          />
          <NavigationBar
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={quizQuestions.length}
            moveToNextQuestion={moveToNextQuestion}
            handleSubmit={handleSubmit}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default QuizQuestionScreen;