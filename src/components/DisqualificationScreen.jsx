import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaHome } from 'react-icons/fa';
import AntiCheatService from '../services/AntiCheatService';

const DisqualificationScreen = ({ handleGoHome }) => {
  const violations = AntiCheatService.getViolations();
  
  return (
    <motion.div
      className="disqualification-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="disqualification-header">
        <h1>Assessment Status</h1>
      </div>

      <div className="disqualification-container">
        <motion.div
          className="disqualification-card"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="status-badge disqualified">
            <FaShieldAlt className="status-icon" />
            <span>Disqualified</span>
          </div>

          <div className="status-message">
            <h2>Assessment Terminated</h2>
            <p>Your assessment has been terminated due to violation of exam integrity policies.</p>
          </div>

          <div className="status-footer">
            <p>For more information, please contact the exam administrator.</p>
          </div>

          <motion.button
            className="btn btn-home"
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