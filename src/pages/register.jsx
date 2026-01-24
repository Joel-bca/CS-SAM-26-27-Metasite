import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserGraduate, FaIdCard, FaEnvelope } from "react-icons/fa";
import "./register.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    regNo: "",
    email: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoToQuiz = () => {
    localStorage.setItem("name", formData.name);
    localStorage.setItem("regNo", formData.regNo);
    localStorage.setItem("email", formData.email);

    navigate("/quiz");
  };

  return (
    <motion.div
      className="register-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="header">
        <img src="/christ-logo.png" alt="Christ Logo" className="logo" />
        <h1>National Voters’ Day Quiz</h1>
        <p>Christ University – Yeshwanthpur Campus</p>
      </div>

      {/* Form Card */}
      <motion.div
        className="form-card"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2>Student Registration</h2>

        <div className="input-group">
          <FaUserGraduate className="icon" />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <FaIdCard className="icon" />
          <input
            type="text"
            name="regNo"
            placeholder="Registration Number"
            value={formData.regNo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <FaEnvelope className="icon" />
          <input
            type="email"
            name="email"
            placeholder="Email ID"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Green CTA Box */}
        <motion.div
          className="go-quiz-box"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleGoToQuiz}
        >
          Go to Quiz →
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Register;
