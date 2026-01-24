import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFilePdf, FaHome } from "react-icons/fa";
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
        scale: 3, // Maintains high quality for PDF
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
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

  return (
    <div className="page-container">
      <div className="certificate-view-area">
        {/* The Scaler div is the secret to fixing the "big" preview */}
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
    </div>
  );
};

export default Certificate;