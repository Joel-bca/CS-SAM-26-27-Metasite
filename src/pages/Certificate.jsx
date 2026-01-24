import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilePdf, FaHome } from "react-icons/fa";
import jsPDF from "jspdf";
import Footer from "../components/Footer";
import "../styles/certificate.css";

const Certificate = () => {
  const navigate = useNavigate();
  const certRef = useRef(null);
  const [userName, setUserName] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const name = localStorage.getItem("voterName");
      if (!name) {
        console.error("No name found in localStorage");
        setError(true);
        // Optional: uncomment to auto-redirect
        // setTimeout(() => navigate("/"), 3000);
      } else {
        setUserName(name);
      }
    } catch (err) {
      console.error("Storage error:", err);
      setError(true);
    }
  }, [navigate]);

  const loadHtml2Canvas = () => {
    return new Promise((resolve) => {
      if (window.html2canvas) return resolve();
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  const downloadPDF = async () => {
    if (!userName) return;
    setIsDownloading(true);
    try {
      await loadHtml2Canvas();
      const canvas = await window.html2canvas(certRef.current, {
        scale: 2, 
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
      pdf.save(`Certificate_${userName.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      alert("Failed to generate PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Error State View
  if (error) {
    return (
      <div className="page-container" style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
        <h2>Oops! No user data found.</h2>
        <p>Please complete the quiz first.</p>
        <button className="btn-home" onClick={() => navigate("/")}>Go to Home</button>
      </div>
    );
  }

  // Loading State View
  if (!userName) {
    return <div className="page-container" style={{justifyContent: 'center', alignItems: 'center'}}>Loading Certificate...</div>;
  }

  return (
    <div className="page-container">
      <div className="certificate-view-area">
        <div className="certificate-scaler">
          <div className="certificate-container" ref={certRef}>
            <img
              src="https://raw.githubusercontent.com/Joel-bca/CS-SAM-26-27-Metasite/c6ee7d3d447d533b8662ad96ee3c445623ca7467/IMG-20260124-WA0014.jpg"
              className="certificate-background"
              alt="Background"
            />
            <div className="name-overlay">
              <h1 className="participant-name">{userName}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="action-bar">
        <button className="btn-pdf" onClick={downloadPDF} disabled={isDownloading}>
          <FaFilePdf /> {isDownloading ? "Generating..." : "Download PDF"}
        </button>
        <button className="btn-home" onClick={() => navigate("/")}>
          <FaHome /> Home
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Certificate;