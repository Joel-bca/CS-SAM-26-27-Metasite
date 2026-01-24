import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaDownload, FaHome } from "react-icons/fa";
import "../styles/certificate.css";

const Certificate = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");

    if (!storedName) {
      alert("No user information found. Please complete the quiz first!");
      navigate("/");
      return;
    }

    setUserName(storedName);
  }, [navigate]);

  const loadHtml2Canvas = () => {
    return new Promise((resolve) => {
      if (window.html2canvas) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  const downloadCertificate = async () => {
    if (!userName) {
      alert("User name missing. Cannot generate certificate.");
      return;
    }

    setIsDownloading(true);

    try {
      await loadHtml2Canvas();

      const certificate = document.querySelector(".certificate-container");

      const canvas = await window.html2canvas(certificate, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `Certificate_${userName.replace(/\s+/g, "_")}.png`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Failed to download certificate. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const goHome = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!userName) {
    return (
      <div className="center-screen">
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
        <h1>Certificate of Achievement</h1>
        <p>Quiz Completion</p>
      </div>

      <motion.div
        className="certificate-container"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Logos */}
        <div className="logos-header">
          <img src="/christ-logo.png" className="cert-logo main-logo" />
          <img src="/logo-samagra.png" className="cert-logo association-logo" />
        </div>

        {/* Background */}
        <img
          src="https://raw.githubusercontent.com/Joel-bca/CS-SAM-26-27-Metasite/cec08b7c1e1ea72d3a62ca1530a4a4e4b8766890/certificate%20votersday.png"
          className="certificate-background"
          alt="Certificate"
        />

        {/* USER NAME */}
        <div className="name-container">
          <div className="participant-name">{userName}</div>
        </div>
      </motion.div>

      <div className="certificate-actions">
        <button
          className="btn btn-primary"
          onClick={downloadCertificate}
          disabled={isDownloading}
        >
          <FaDownload />
          {isDownloading ? "Generating..." : "Download Certificate"}
        </button>

        <button className="btn btn-secondary" onClick={goHome}>
          <FaHome /> Home
        </button>
      </div>

      <div className="status-message success">
        🎉 Certificate generated successfully!
      </div>
    </motion.div>
  );
};

export default Certificate;
