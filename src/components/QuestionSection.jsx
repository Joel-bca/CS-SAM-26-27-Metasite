import React from 'react';
import { motion } from 'framer-motion';

const QuestionSection = ({ currentQuestion, answers, currentQuestionIndex, handleAnswerChange }) => {
  const isAnswered = answers[currentQuestionIndex] !== -1;

  const handleOptionClick = (optionIndex) => {
    handleAnswerChange(currentQuestionIndex, optionIndex);
  };

  return (
    <div className="question-section">
      <div className="question-number-badge">Question {currentQuestion.id}</div>
      <h2 className="question-title">{currentQuestion.question}</h2>
      <div className="options-container">
        {currentQuestion.options.map((option, optionIndex) => (
          <motion.div
            key={optionIndex}
            className={`option-item ${
              answers[currentQuestionIndex] === optionIndex ? "selected" : ""
            } ${
              isAnswered && answers[currentQuestionIndex] === optionIndex ? "answered" : ""
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOptionClick(optionIndex)}
            style={{ cursor: 'pointer' }}
          >
            <input
              type="radio"
              name={`question-${currentQuestionIndex}`}
              id={`option-${optionIndex}`}
              checked={answers[currentQuestionIndex] === optionIndex}
              onChange={() => handleOptionClick(optionIndex)}
              className="option-radio"
              onClick={(e) => e.stopPropagation()}
            />
            <label 
              htmlFor={`option-${optionIndex}`} 
              className="option-label-text"
              onClick={(e) => e.preventDefault()}
            >
              <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>
              <span className="option-text">{option}</span>
            </label>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuestionSection;