import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuiz } from "@/contexts/QuizContext";
import { PASSING_MARKS_PERCENTAGE } from "@/data/questions";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";
import jsPDF from "jspdf";

const Certificate = () => {
  const { student, score, totalQuestions, quizCompleted } = useQuiz();

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!student || !quizCompleted) return <Navigate to="/" replace />;

  const percentage =
    totalQuestions > 0
      ? Math.round((score / totalQuestions) * 100)
      : 0;

  if (percentage < PASSING_MARKS_PERCENTAGE)
    return <Navigate to="/result" replace />;

  const today = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /* =========================
     DOWNLOAD PDF
  ========================= */

  const handleDownload = () => {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const w = pdf.internal.pageSize.getWidth();

    pdf.setFont("times", "bold");
    pdf.setFontSize(36);
    pdf.text("Certificate of Completion", w / 2, 50, { align: "center" });

    pdf.setFontSize(24);
    pdf.text(student.fullName, w / 2, 90, { align: "center" });

    pdf.setFontSize(14);
    pdf.text(
      `Score: ${score}/${totalQuestions} (${percentage}%)`,
      w / 2,
      120,
      { align: "center" }
    );

    pdf.text(today, w / 2, 140, { align: "center" });

    pdf.save(`Certificate_${student.fullName}.pdf`);
  };

  /* =========================
     SEND EMAIL
  ========================= */

  const handleSendEmail = async () => {
    if (sent) return;

    setSending(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-certificate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: student.email,
            name: student.fullName,
            regNumber: student.regNumber,
            department: student.department,
            score,
            percentage,
          }),
        }
      );

      if (!res.ok) throw new Error("Send failed");

      setSent(true);
      setSuccessMsg("✅ Certificate sent successfully to your email!");

    } catch (err) {
      setErrorMsg("❌ Failed to send certificate. Please try again.");
    }

    setSending(false);
  };

  /* =========================
     UI
  ========================= */

  return (
    <Layout>
      <div className="text-center space-y-6">

        <h1 className="text-3xl font-bold">
          Congratulations {student.fullName}
        </h1>

        <p>You passed with {percentage}%</p>

        {/* SUCCESS MESSAGE */}
        {successMsg && (
          <p className="text-green-600 text-sm font-medium">
            {successMsg}
          </p>
        )}

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <p className="text-red-600 text-sm font-medium">
            {errorMsg}
          </p>
        )}

        <div className="flex justify-center gap-4">

          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Certificate
          </Button>

          <Button
            onClick={handleSendEmail}
            disabled={sending || sent}
          >
            <Mail className="mr-2 h-4 w-4" />
            {sent
              ? "Email Sent"
              : sending
              ? "Sending..."
              : "Send to Email"}
          </Button>

        </div>

      </div>
    </Layout>
  );
};

export default Certificate;