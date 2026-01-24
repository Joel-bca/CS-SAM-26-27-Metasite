import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaDownload, FaHome, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import "../styles/certificate.css";

const Certificate = () => {
  const navigate = useNavigate();
  const certRef = useRef(null);
  const [userName, setUserName] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("voterName");
    if (!name) {
      alert("No user information found. Please register first.");
      navigate("/");
      return;
    }
    setUserName(name);
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
    setIsDownloading(true);
    try {
      await loadHtml2Canvas();
      const element = certRef.current;

      const canvas = await window.html2canvas(element, {
        scale: 3, // High resolution
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      
      // Initialize jsPDF: Landscape ('l'), millimeters ('mm'), A4 size
      const pdf = new jsPDF("l", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificate_${userName.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  const goHome = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!userName) return <p className="loading-text">Loading certificate…</p>;

  return (
    <motion.div 
      className="page-wrapper"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
    >
      <div className="certificate-viewport">
        <div className="certificate-container" ref={certRef}>
          {/* Main Background Image */}
          <img
            src="https://raw.githubusercontent.com/Joel-bca/CS-SAM-26-27-Metasite/c6ee7d3d447d533b8662ad96ee3c445623ca7467/IMG-20260124-WA0014.jpg"
            className="certificate-background"
            alt="Certificate Background"
          />
          
          <div className="name-container">
            <div className="participant-name">{userName}</div>
          </div>
        </div>
      </div>

      <div className="certificate-actions">
        <button className="btn btn-primary" onClick={downloadPDF} disabled={isDownloading}>
          <FaFilePdf /> {isDownloading ? "Generating PDF..." : "Download PDF"}
        </button>
        <button className="btn btn-secondary" onClick={goHome}>
          <FaHome /> Home
        </button>
      </div>
    </motion.div>
  );
};

export default Certificate;