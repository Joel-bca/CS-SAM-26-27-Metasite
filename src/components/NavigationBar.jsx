import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const NavigationBar = ({
  currentQuestionIndex,
  totalQuestions,
  moveToNextQuestion,
  handleSubmit
}) => {
  return (
    <div className="navigation-bar">
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
        <span className="progress-text-small">
          {currentQuestionIndex + 1}/{totalQuestions}
        </span>
      </div>

      {currentQuestionIndex === totalQuestions - 1 ? (
        <motion.button
          className="nav-btn next-btn submit-btn"
          onClick={handleSubmit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Submit <FaCheckCircle />
        </motion.button>
      ) : (
        <motion.button
          className="nav-btn next-btn"
          onClick={moveToNextQuestion}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next <FaArrowRight />
        </motion.button>
      )}
    </div>
  );
};

export default NavigationBar;