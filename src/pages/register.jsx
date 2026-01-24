import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegistrationForm from "../components/RegistrationForm";
import AntiCheatService from "../services/AntiCheatService";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("voterName");
    const storedRegNo = localStorage.getItem("voterRegNo");
    if (storedName) setName(storedName);
    if (storedRegNo) setRegNo(storedRegNo);

    AntiCheatService.resetViolations();
  }, []);

  const handleGoToQuiz = () => {
    if (!name.trim()) return setError("Name is required");
    if (!regNo.trim()) return setError("Register Number is required");

    localStorage.setItem("voterName", name);
    localStorage.setItem("voterRegNo", regNo);
    localStorage.setItem("registrationTime", new Date().toISOString());

    AntiCheatService.startMonitoring();
    navigate("/rules");
  };

  return (
    <RegistrationForm
      name={name}
      regNo={regNo}
      error={error}
      onNameChange={(e) => setName(e.target.value)}
      onRegNoChange={(e) => setRegNo(e.target.value)}
      onSubmit={handleGoToQuiz}
      onKeyPress={(e) => e.key === "Enter" && handleGoToQuiz()}
    />
  );
};

export default Register;
               