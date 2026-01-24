import React from 'react';
import { motion } from 'framer-motion';
import {
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaFileAlt,
  FaHome
} from 'react-icons/fa';

const QuizResultsScreen = ({
  score,
  correctCount,
  quizQuestions,
  answers,
  handleViewCertificate,
  handleRetakeQuiz,
  handleGoHome
}) => {
  return (
    <motion.div
      className="quiz-page results-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="results-header">
        <h1>Quiz Completed!</h1>
        <p>Your Performance Analysis</p>
      </div>

      <motion.div
        className="score-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="score-display">
          <div className="score-circle">
            <div className="score-percentage">{score}%</div>
            <div className="score-label">Score</div>
          </div>
        </div>

        <div className="score-stats">
          <div className="stat-item correct-stat">
            <FaCheckCircle className="stat-icon" />
            <div>
              <div className="stat-number">{correctCount}</div>
              <div className="stat-label">Correct Answers</div>
            </div>
          </div>
          <div className="stat-item incorrect-stat">
            <FaTimesCircle className="stat-icon" />
            <div>
              <div className="stat-number">{20 - correctCount}</div>
              <div className="stat-label">Incorrect Answers</div>
            </div>
          </div>
        </div>

        <div className="performance-message">
          {score >= 80 && <p> Excellent Performance! You're eligible for a certificate!</p>}
          {score >= 60 && score < 80 && <p> Great Job! You need 80% for a certificate. Please retake to improve!</p>}
          {score >= 40 && score < 60 && <p> Good Effort! Retake the quiz to reach 80% for certificate eligibility!</p>}
          {score < 40 && <p> Keep Trying! Review and retake the quiz to achieve 80%!</p>}
        </div>
      </motion.div>

      <div className="results-actions">
        <motion.button
          className="btn btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleViewCertificate}
        >
          <FaFileAlt /> View Certificate
        </motion.button>
        <motion.button
          className="btn btn-secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRetakeQuiz}
        >
          <FaEdit /> Retake Quiz
        </motion.button>
        <motion.button
          className="btn btn-tertiary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoHome}
        >
          <FaHome /> Go Home
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuizResultsScreen;