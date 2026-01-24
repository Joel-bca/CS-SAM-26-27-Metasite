import React from 'react';

const QuizTopBar = ({ voterName, currentQuestionIndex, totalQuestions, answers }) => {
  const answeredCount = answers.filter(a => a !== -1).length;

  return (
    <div className="quiz-top-bar">
      <div className="quiz-info">
        <h1>National Voters' Day Quiz</h1>
        <p>Welcome, <strong>{voterName}</strong></p>
      </div>
      <div className="quiz-stats">
        <span className="progress-text">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </span>
        <span className="answered-text">
          Answered: {answeredCount}/{totalQuestions}
        </span>
      </div>
    </div>
  );
};

export default QuizTopBar;