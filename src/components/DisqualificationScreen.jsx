import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaHome } from 'react-icons/fa';
import AntiCheatService from '../services/AntiCheatService';

const DisqualificationScreen = ({ handleGoHome }) => {
  return (
    <motion.div
      className="quiz-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="disqualification-screen">
        <motion.div
          className="disqualification-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FaShieldAlt className="disqualification-icon" />
          <h1>❌ Disqualified</h1>
          <p>Your exam has been terminated due to violation of exam integrity rules.</p>

          <div className="violation-details">
            <h3>Violations Detected:</h3>
            <ul>
              {AntiCheatService.getViolations().map((v, idx) => (
                <li key={idx}>
                  🚫 {v.type} - {new Date(v.timestamp).toLocaleTimeString()}
                </li>
              ))}
            </ul>
          </div>

          <p className="disqualification-message">
            Please contact the exam administrator for more information.
          </p>

          <motion.button
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoHome}
          >
            <FaHome /> Return to Home
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DisqualificationScreen;