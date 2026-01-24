import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";
import "../styles/rules.css";

const Rules = () => {
  const navigate = useNavigate();
  const [voterName, setVoterName] = useState("");
  const [rulesAccepted, setRulesAccepted] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("voterName");
    if (!name) {
      navigate("/");
      return;
    }
    setVoterName(name);
  }, [navigate]);

  const handleProceedToQuiz = () => {
    if (!rulesAccepted) {
      alert("Please accept the rules and regulations to proceed.");
      return;
    }
    navigate("/quiz");
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <motion.div
      className="rules-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="rules-header">
        <img 
          src="https://raw.githubusercontent.com/Joel-bca/CS-SAM-26-27-Metasite/9f7c2746ec4ea940c7d622fcb4ab477379765386/chirst_logo.png" 
          alt="Christ Logo" 
          className="rules-logo" 
        />
        <h1>National Voters' Day Quiz</h1>
        <p>CHRIST UNIVERSITY - Yeshwanthpur Campus</p>
        <p>DEPARTMENT OF COMPUTER SCIENCE</p>
        <p>SAMAGRA ASSOCIATION</p>
      </div>

      <motion.div
        className="rules-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className="rules-content">
          <p className="welcome-text">Welcome, <strong>{voterName}</strong></p>
          <p className="instructions-text">Please read the following rules carefully before proceeding with the quiz.</p>

          <div className="rules-list">
            <motion.div 
              className="rule-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="rule-number">1</div>
              <div className="rule-content">
                <h3><strong>20 QUESTIONS</strong></h3>
              </div>
            </motion.div>
          </div>

          <div className="rules-list">
            <motion.div 
              className="rule-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="rule-number">2</div>
              <div className="rule-content">
                <h3><strong>30 SECONDS PER QUESTION</strong></h3>
              </div>
            </motion.div>
          </div>

                    <div className="rules-list">
            <motion.div 
              className="rule-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="rule-number">3</div>
              <div className="rule-content">
                <h3><strong>NO TAB OR WINDOW SHIFTING</strong></h3>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="all-the-best"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2><strong>ALL THE BEST!</strong></h2>
          </motion.div>

          <div className="acceptance-section">
            <label className="acceptance-checkbox">
              <input
                type="checkbox"
                checked={rulesAccepted}
                onChange={(e) => setRulesAccepted(e.target.checked)}
              />
              <span>I have read and understood all the rules and regulations. I agree to comply with them.</span>
            </label>
          </div>

          <div className="rules-actions">
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProceedToQuiz}
              disabled={!rulesAccepted}
            >
              Proceed to Quiz <FaArrowRight />
            </motion.button>

            <motion.button
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoBack}
            >
              Go Back
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Rules;
