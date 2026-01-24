import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaFileAlt,
  FaHome,
  FaArrowLeft,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";
import AntiCheatService from "../services/AntiCheatService";
import "../styles/quiz.css";

const quizQuestions = [
  {
    id: 1,
    question: "International Voters' Day is celebrated every year on:",
    options: ["24 January", "25 January", "26 January", "30 January"],
    correct: 1, // Index B
  },
  {
    id: 2,
    question: "International Voters' Day commemorates the establishment of:",
    options: ["Indian Constitution", "Parliament of India", "Election Commission of India", "Supreme Court of India"],
    correct: 2, // Index C
  },
  {
    id: 3,
    question: "The Election Commission of India was established in:",
    options: ["1947", "1949", "1950", "1952"],
    correct: 2, // Index C
  },
  {
    id: 4,
    question: "The primary objective of International Voters' Day is to:",
    options: ["Promote political parties", "Encourage voter awareness and participation", "Announce election results", "Conduct opinion polls"],
    correct: 1, // Index B
  },
  {
    id: 5,
    question: "Who among the following can vote in India?",
    options: ["Citizens above 16 years", "Residents above 18 years", "Citizens above 18 years", "Citizens above 21 years"],
    correct: 2, // Index C
  },
  {
    id: 6,
    question: "Voting in India is considered a:",
    options: ["Fundamental Right", "Legal Right", "Fundamental Duty", "Moral Obligation only"],
    correct: 1, // Index B
  },
  {
    id: 7,
    question: "Which document is commonly used as proof for voting?",
    options: ["Aadhaar Card", "PAN Card", "Voter ID Card", "Passport"],
    correct: 2, // Index C
  },
  {
    id: 8,
    question: "International Voters' Day was first celebrated in India in:",
    options: ["2005", "2008", "2011", "2015"],
    correct: 2, // Index C
  },
  {
    id: 9,
    question: "Which group is mainly encouraged during International Voters' Day celebrations?",
    options: ["Senior citizens", "Political leaders", "First-time voters", "Government officials"],
    correct: 2, // Index C
  },
  {
    id: 10,
    question: "The main role of the Election Commission of India is to:",
    options: ["Frame election laws", "Conduct free and fair elections", "Declare political parties", "Appoint judges"],
    correct: 1, // Index B
  },
  {
    id: 11,
    question: "Which of the following is NOT a function of the Election Commission of India?",
    options: ["Preparing electoral rolls", "Conducting elections", "Framing laws", "Enforcing the Model Code of Conduct"],
    correct: 2, // Index C
  },
  {
    id: 12,
    question: "Elections in India are conducted under the provision of:",
    options: ["Indian Penal Code", "Representation of the People Act", "Right to Information Act", "Citizenship Act"],
    correct: 1, // Index B
  },
  {
    id: 13,
    question: "Article related to elections in the Indian Constitution is:",
    options: ["Article 14", "Article 19", "Article 324", "Article 356"],
    correct: 2, // Index C
  },
  {
    id: 14,
    question: "Voter registration in India is based on the principle of:",
    options: ["Proportional Representation", "Universal Adult Franchise", "Separate Electorate", "Indirect Election"],
    correct: 1, // Index B
  },
  {
    id: 15,
    question: "International Voters' Day promotes which democratic value?",
    options: ["Judicial review", "Equality before law", "Popular sovereignty", "Federalism"],
    correct: 2, // Index C
  },
  {
    id: 16,
    question: "The right to vote ensures citizens' participation in:",
    options: ["Judiciary", "Executive", "Democracy", "Bureaucracy"],
    correct: 2, // Index C
  },
  {
    id: 17,
    question: "Which of the following best describes the importance of voting?",
    options: ["Personal benefit", "Political pressure", "Citizen's voice in governance", "Party loyalty"],
    correct: 2, // Index C
  },
  {
    id: 18,
    question: "Who issues the Voter ID card in India?",
    options: ["Ministry of Home Affairs", "Election Commission of India", "State Government", "Parliament"],
    correct: 1, // Index B
  },
  {
    id: 19,
    question: "International Voters' Day is celebrated to recognize the role of:",
    options: ["Political leaders", "Election officials", "Voters", "Political parties"],
    correct: 2, // Index C
  },
  {
    id: 20,
    question: "Free and fair elections are essential for:",
    options: ["Dictatorship", "Monarchy", "Democracy", "Oligarchy"],
    correct: 2, // Index C
  },
];

const Quiz = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(Array(20).fill(-1));
  const [currentView, setCurrentView] = useState("quiz"); // quiz, review, results
  const [showResults, setShowResults] = useState(false);
  const [voterName, setVoterName] = useState("");
  const [isDisqualified, setIsDisqualified] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("voterName");
    if (!name) {
      navigate("/");
      return;
    }
    setVoterName(name);

    const savedAnswers = localStorage.getItem("quizAnswers");
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    }

    // Check if student was already disqualified
    if (AntiCheatService.isStudentDisqualified()) {
      setIsDisqualified(true);
      return;
    }

    // Listen for disqualification event
    const handleDisqualification = () => {
      setIsDisqualified(true);
    };

    window.addEventListener("studentDisqualified", handleDisqualification);
    return () => {
      window.removeEventListener("studentDisqualified", handleDisqualification);
    };
  }, [navigate]);

  const handleAnswerChange = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
    localStorage.setItem("quizAnswers", JSON.stringify(newAnswers));
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizQuestions[index].correct) {
        correct++;
      }
    });
    return Math.round((correct / 20) * 100);
  };

  const handleSubmit = () => {
    if (answers.includes(-1)) {
      alert("Please answer all questions before submitting!");
      return;
    }
    setShowResults(true);
    setCurrentView("results");
  };

  const handleViewCertificate = () => {
    localStorage.setItem("quizCompleted", "true");
    navigate("/certificate");
  };

  const handleRetakeQuiz = () => {
    setAnswers(Array(20).fill(-1));
    localStorage.removeItem("quizAnswers");
    setShowResults(false);
    setCurrentView("quiz");
  };

  const handleGoHome = () => {
    localStorage.removeItem("voterName");
    localStorage.removeItem("quizAnswers");
    localStorage.removeItem("quizCompleted");
    navigate("/");
  };

  const score = calculateScore();
  const correctCount = answers.filter((ans, idx) => ans === quizQuestions[idx].correct).length;

  if (showResults && currentView === "results") {
    return (
      <motion.div
        className="quiz-results-page"
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
            {score >= 80 && <p>🎉 Excellent Performance! You're a voting knowledge expert!</p>}
            {score >= 60 && score < 80 && <p>👏 Great Job! You have good understanding of voting!</p>}
            {score >= 40 && score < 60 && <p>📚 Good Effort! Keep learning about voting rights!</p>}
            {score < 40 && <p>💡 Keep Trying! Review the answers and try again!</p>}
          </div>
        </motion.div>

        {/* Scoresheet */}
        <motion.div
          className="scoresheet-container"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2>
            <FaFileAlt /> Detailed Scoresheet
          </h2>

          <div className="scoresheet-questions">
            {quizQuestions.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === question.correct;

              return (
                <motion.div
                  key={question.id}
                  className={`scoresheet-item ${isCorrect ? "correct" : "incorrect"}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.02 }}
                >
                  <div className="question-number">Q{question.id}</div>

                  <div className="question-content">
                    <p className="question-text">{question.question}</p>

                    <div className="answer-display">
                      <div className="user-answer">
                        <span className="label">Your Answer:</span>
                        <span className={`answer-text ${isCorrect ? "correct-answer" : "wrong-answer"}`}>
                          {userAnswer !== -1
                            ? `${String.fromCharCode(65 + userAnswer)}) ${question.options[userAnswer]}`
                            : "Not Answered"}
                        </span>
                      </div>

                      {!isCorrect && (
                        <div className="correct-answer-display">
                          <span className="label">Correct Answer:</span>
                          <span className="answer-text correct-answer">
                            {`${String.fromCharCode(65 + question.correct)}) ${question.options[question.correct]}`}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="result-badge">
                      {isCorrect ? (
                        <>
                          <FaCheckCircle /> Correct
                        </>
                      ) : (
                        <>
                          <FaTimesCircle /> Incorrect
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
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
  }

  // Disqualification Screen
  if (isDisqualified) {
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
              onClick={() => {
                localStorage.clear();
                AntiCheatService.stopMonitoring();
                navigate("/");
              }}
            >
              <FaHome /> Return to Home
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="quiz-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="quiz-header">
        <img src="https://raw.githubusercontent.com/Joel-bca/CS-SAM-26-27-Metasite/9f7c2746ec4ea940c7d622fcb4ab477379765386/chirst_logo.png" alt="Christ Logo" className="logo" />
        <h1>National Voters' Day Quiz</h1>
        <p>Welcome, <strong>{voterName}</strong></p>
      </div>

      <div className="quiz-progress">
        <span>Total Questions: 20</span>
        <span>Progress: {answers.filter(a => a !== -1).length}/20</span>
      </div>

      <motion.div
        className="quiz-container"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="questions-grid">
          {quizQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              className="question-card"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.02 }}
            >
              <div className="question-header">
                <h3>Question {question.id}</h3>
                {answers[index] !== -1 && (
                  <span className="answered-badge">
                    <FaCheckCircle /> Answered
                  </span>
                )}
              </div>

              <p className="question-text">{question.question}</p>

              <div className="options-grid">
                {question.options.map((option, optionIndex) => (
                  <motion.button
                    key={optionIndex}
                    className={`option-button ${answers[index] === optionIndex ? "selected" : ""}`}
                    onClick={() => handleAnswerChange(index, optionIndex)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="option-label">{String.fromCharCode(65 + optionIndex)}.</span>
                    <span className="option-text">{option}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="quiz-actions">
          <motion.button
            className="btn btn-primary btn-large"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
          >
            <FaCheckCircle /> Submit Quiz & View Results
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Quiz;
