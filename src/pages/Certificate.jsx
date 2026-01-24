import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaDownload, FaHome } from "react-icons/fa";
import "../styles/certificate.css";

const Certificate = () => {
  const navigate = useNavigate();
  const [voterName, setVoterName] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("voterName");
    if (!name) {
      alert("No voter information found. Please register first!");
      navigate("/");
      return;
    }
    setVoterName(name);
  }, [navigate]);

  const downloadCertificate = async () => {
    if (!voterName) {
      alert("Unable to download. Voter name not found!");
      return;
    }

    setIsDownloading(true);
    try {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";

      script.onload = function () {
        const certificateContainer = document.querySelector(
          ".certificate-container"
        );
        window.html2canvas(certificateContainer, {
          scale: 3,
          backgroundColor: "transparent",
          logging: false,
          useCORS: true,
          allowTaint: true,
        }).then((canvas) => {
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = `Certificate_${voterName.replace(
            /\s+/g,
            "_"
          )}_Voters_Day.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setIsDownloading(false);
        });
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error("Error generating certificate:", error);
      alert("Failed to download certificate. Please try again.");
      setIsDownloading(false);
    }
  };

  const goHome = () => {
    localStorage.removeItem("voterName");
    localStorage.removeItem("voterRegNo");
    localStorage.removeItem("quizAnswers");
    localStorage.removeItem("quizCompleted");
    navigate("/");
  };

  if (!voterName) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading certificate...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="certificate-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="certificate-header">
        <h1>Certificate of Participation</h1>
        <p>National Voters' Day Quiz</p>
      </div>

      <motion.div
        className="certificate-container"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Logos Header */}
        <div className="logos-header">
          <div className="logo-item">
            <img 
              src="/christ-logo.png" 
              alt="Christ University Logo" 
              className="cert-logo main-logo"
            />
          </div>
          <div className="logo-item">
            <img 
              src="/logo-samagra.png" 
              alt="Samagra Association Logo" 
              className="cert-logo association-logo"
            />
          </div>
        </div>

        <img
          src="https://raw.githubusercontent.com/Joel-bca/CS-SAM-26-27-Metasite/cec08b7c1e1ea72d3a62ca1530a4a4e4b8766890/certificate%20votersday.png"
          alt="Certificate of Participation"
          className="certificate-background"
        />

        <div className="name-container">
          <div className="participant-name">{voterName}</div>
        </div>
      </motion.div>

      <motion.div
        className="certificate-actions"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button
          className="btn btn-primary"
          onClick={downloadCertificate}
          disabled={isDownloading}
        >
          <FaDownload /> {isDownloading ? "Downloading..." : "Download Certificate"}
        </button>
        <button className="btn btn-secondary" onClick={goHome}>
          <FaHome /> Go to Home
        </button>
      </motion.div>

      <motion.div
        className="status-message success"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        ✓ Certificate is ready! You can download it now.
      </motion.div>
    </motion.div>
  );
};

export default Certificate;
