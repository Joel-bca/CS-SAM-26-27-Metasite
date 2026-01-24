

import { motion } from "framer-motion";
import {
  FaUserGraduate,
  FaIdCard,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import "../styles/register.css";

const RegistrationForm = ({ name, regNo, error, onNameChange, onRegNoChange, onSubmit, onKeyPress }) => {
  return (
    <motion.div
      className="register-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="header">
        <img src="https://raw.githubusercontent.com/Joel-bca/CS-SAM-26-27-Metasite/9f7c2746ec4ea940c7d622fcb4ab477379765386/chirst_logo.png" alt="Christ Logo" className="logo" />
        <h1>National Voters' Day Quiz</h1>
        <p>CHRIST UNIVERSITY – Yeshwanthpur Campus</p>
        <p>DEPARTMENT OF COMPUTER SCIENCE</p>
        <p>SAMAGRA ASSOCIATION</p>
      </div>

      <motion.div
        className="form-card"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2>Welcome to the Quiz</h2>
        <p className="step-subtitle">Enter your details to get started</p>

        <div className="input-group">
          <FaUserGraduate className="icon" />
          <input
            type="text"
            placeholder="Your Full Name"
            value={name}
            onChange={onNameChange}
            onKeyPress={onKeyPress}
            required
          />
        </div>

        <div className="input-group">
          <FaIdCard className="icon" />
          <input
            type="text"
            placeholder="Register Number"
            value={regNo}
            onChange={onRegNoChange}
            onKeyPress={onKeyPress}
            required
          />
        </div>

        {error && <span className="error-text">{error}</span>}

        <motion.div
          className="go-quiz-box"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onSubmit}
        >
          <FaCheckCircle /> Start Quiz <FaArrowRight />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default RegistrationForm;
