import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import QuizHeader from './QuizHeader';

const QuizStartScreen = ({ voterName, handleStartQuiz }) => {
  return (
    <>
      <QuizHeader voterName={voterName} />
      <motion.div
        className="quiz-start-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="start-content">
          <h2>Ready to Start the Quiz?</h2>
          <p>📝 20 Questions</p>
          <p>⏱️ 30 seconds per question</p>
          <p>💡 Test your knowledge about National Voters' Day</p>
          <motion.button
            className="btn btn-primary btn-large"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartQuiz}
          >
            <FaArrowRight /> Start Quiz Now
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default QuizStartScreen;