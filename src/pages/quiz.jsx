import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AntiCheatService from "../services/AntiCheatService";
import QuizQuestionScreen from "../components/QuizQuestionScreen";
import QuizResultsScreen from "../components/QuizResultsScreen";
import DisqualificationScreen from "../components/DisqualificationScreen";
import "../styles/quiz.css";

const quizQuestions = [
  { id: 1, question: "National Voters' Day is celebrated every year on:", options: ["26 January", "24 January", "30 January", "25 January"], correct: 3 },
  { id: 2, question: "Which situation best represents the objective of National Voters' Day in practice?", options: ["A political party releasing its election manifesto", "A voter choosing NOTA without knowing candidate details", "A first-time voter registering, learning about candidates, and voting responsibly", "A government announcing election results early"], correct: 2 },
  { id: 3, question: "The Election Commission of India was established in:", options: ["1949", "1952", "1950", "1947"], correct: 2 },
  { id: 4, question: "The primary objective of National Voters' Day is to:", options: ["Conduct opinion polls", "Promote political parties", "Announce election results", "Encourage voter awareness and participation"], correct: 3 },
  { id: 5, question: "Who among the following is eligible to vote in India?", options: ["Citizens above 18 years", "Residents above 18 years", "Citizens above 21 years", "Citizens above 16 years"], correct: 0 },
  { id: 6, question: "Voting in India is considered a:", options: ["Fundamental Duty", "Fundamental Right", "Moral Obligation only", "Legal Right"], correct: 3 },
  { id: 7, question: "Which document is officially issued for voting purposes in India?", options: ["Passport", "Voter ID Card", "PAN Card", "Aadhaar Card"], correct: 1 },
  { id: 8, question: "National Voters' Day was first celebrated in India in:", options: ["2008", "2011", "2005", "2015"], correct: 1 },
  { id: 9, question: "Which group is mainly encouraged during National Voters' Day celebrations?", options: ["Political leaders", "Government officials", "First-time voters", "Senior citizens"], correct: 2 },
  { id: 10, question: "The main role of the Election Commission of India is to:", options: ["Declare political parties", "Appoint judges", "Conduct free and fair elections", "Frame election laws"], correct: 2 },
  { id: 11, question: "Which of the following is NOT a function of the Election Commission of India?", options: ["Enforcing the Model Code of Conduct", "Preparing electoral rolls", "Conducting elections", "Framing laws"], correct: 3 },
  { id: 12, question: "Which of the following activities is most closely associated with National Voters' Day celebrations in India?", options: ["Declaring election results", "Organizing voter awareness programs and enrollment drives", "Launching political campaigns", "Conducting exit polls"], correct: 1 },
  { id: 13, question: "Article 324 of the Indian Constitution deals with:", options: ["Reservation of seats", "Universal adult franchise", "Disqualification of members", "Powers and functions of the Election Commission"], correct: 3 },
  { id: 14, question: "The principle that allows every adult citizen to vote without discrimination is known as:", options: ["Separate Electorate", "Proportional Representation", "Electoral College", "Universal Adult Franchise"], correct: 3 },
  { id: 15, question: "From a democratic perspective, National Voters' Day primarily reinforces which principle?", options: ["Separation of powers", "Rule of law", "Federalism", "Popular participation in governance"], correct: 3 },
  { id: 16, question: "Which of the following best reflects the educational purpose of National Voters' Day?", options: ["Training political candidates", "Encouraging party membership", "Promoting informed and ethical voting", "Announcing election schedules"], correct: 2 },
  { id: 17, question: "Participation in elections strengthens democracy primarily because it:", options: ["Reduces administrative workload", "Increases government revenue", "Allows citizens to choose their representatives", "Ensures political stability only"], correct: 2 },
  { id: 18, question: "Voter awareness initiatives under National Voters' Day aim to reduce:", options: ["Number of political parties", "Election expenditure", "Political competition", "Voter apathy and misinformation"], correct: 3 },
  { id: 19, question: "National Voters' Day is celebrated to recognize the importance of:", options: ["Political leaders", "Voters", "Election officials", "Political parties"], correct: 1 },
  { id: 20, question: "Free and fair elections are essential for the survival of:", options: ["Oligarchy", "Monarchy", "Democracy", "Dictatorship"], correct: 2 },
];

const Quiz = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(Array(20).fill(-1));
  const [currentView, setCurrentView] = useState("quiz"); 
  const [showResults, setShowResults] = useState(false);
  const [voterName, setVoterName] = useState("");
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); 
  const [quizStarted, setQuizStarted] = useState(false);
  const timerRef = useRef(null);

  // --- SCORE CALCULATION ---
  const calculateScore = (currentAnswers) => {
    let correct = 0;
    currentAnswers.forEach((answer, index) => {
      if (answer === quizQuestions[index].correct) {
        correct++;
      }
    });
    return Math.round((correct / quizQuestions.length) * 100);
  };

  // --- SUBMIT LOGIC ---
  const submitQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const finalScore = calculateScore(answers);
    
    // Redirect directly if they pass, otherwise show result messages
    if (finalScore >= 80) {
      localStorage.setItem("quizCompleted", "true");
      localStorage.setItem("quizScore", finalScore.toString());
      navigate("/certificate");
    } else {
      setShowResults(true);
      setCurrentView("results");
    }
  };

  // 1. Timer Logic
  useEffect(() => {
    if (!quizStarted || showResults || isDisqualified) return;

    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentQuestionIndex, quizStarted, showResults, isDisqualified]);

  // 2. Auto-advance/submit on timeout
  useEffect(() => {
    if (timeLeft === 0 && quizStarted && !showResults) {
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        submitQuiz();
      }
    }
  }, [timeLeft]);

  // 3. Mount Logic
  useEffect(() => {
    const name = localStorage.getItem("voterName");
    if (!name) {
      navigate("/");
      return;
    }
    setVoterName(name);
    setQuizStarted(true); 

    const savedAnswers = localStorage.getItem("quizAnswers");
    if (savedAnswers) {
      try {
        const parsed = JSON.parse(savedAnswers);
        if (parsed.length === 20) setAnswers(parsed);
      } catch (e) { console.error(e); }
    }

    if (AntiCheatService.isStudentDisqualified()) setIsDisqualified(true);

    const handleDisq = () => setIsDisqualified(true);
    window.addEventListener("studentDisqualified", handleDisq);
    return () => window.removeEventListener("studentDisqualified", handleDisq);
  }, [navigate]);

  // 4. Interaction Handlers
  const handleAnswerChange = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
    localStorage.setItem("quizAnswers", JSON.stringify(newAnswers));
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleRetakeQuiz = () => {
    setAnswers(Array(20).fill(-1));
    localStorage.removeItem("quizAnswers");
    setShowResults(false);
    setCurrentView("quiz");
    setCurrentQuestionIndex(0);
    setTimeLeft(30);
    setQuizStarted(true);
  };

  const handleGoHome = () => {
    localStorage.clear();
    navigate("/");
  };

  // 5. Handling Certificate from Results Screen
  const handleViewCertificate = () => {
    const score = calculateScore(answers);
    if (score >= 80) {
      localStorage.setItem("quizCompleted", "true");
      localStorage.setItem("quizScore", score.toString());
      navigate("/certificate");
    } else {
      alert(`Your score is ${score}%. You need at least 80% to be eligible for a certificate. Please retake the quiz.`);
    }
  };

  if (isDisqualified) return (
    <>
      <DisqualificationScreen handleGoHome={handleGoHome} />
      <Footer />
    </>
  );

  if (showResults && currentView === "results") {
    const score = calculateScore(answers);
    const correctCount = answers.filter((ans, idx) => ans === quizQuestions[idx].correct).length;
    return (
      <>
        <QuizResultsScreen
          score={score}
          correctCount={correctCount}
          quizQuestions={quizQuestions}
          answers={answers}
          handleViewCertificate={handleViewCertificate}
          handleRetakeQuiz={handleRetakeQuiz}
          handleGoHome={handleGoHome}
        />
        <Footer />
      </>
    );
  }

  return (
    <>
      <QuizQuestionScreen
        voterName={voterName}
        currentQuestionIndex={currentQuestionIndex}
        quizQuestions={quizQuestions}
        answers={answers}
        timeLeft={timeLeft}
        handleAnswerChange={handleAnswerChange}
        moveToNextQuestion={moveToNextQuestion}
        handleSubmit={submitQuiz}
      />
    </>
  );
};

export default Quiz;