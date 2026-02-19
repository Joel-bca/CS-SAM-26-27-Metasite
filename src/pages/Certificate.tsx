import { useRef } from "react";
import { Navigate } from "react-router-dom";
import { useQuiz } from "@/contexts/QuizContext";
import { PASSING_PERCENTAGE } from "@/data/questions";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";

const Certificate = () => {
  const { student, score, totalQuestions, quizCompleted } = useQuiz();
  const certRef = useRef<HTMLDivElement>(null);

  if (!student || !quizCompleted) return <Navigate to="/" replace />;
  const percentage = Math.round((score / totalQuestions) * 100);
  if (percentage < PASSING_PERCENTAGE) return <Navigate to="/result" replace />;

  const today = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  const handleDownload = () => {
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();

    // Border
    pdf.setDrawColor(30, 58, 95);
    pdf.setLineWidth(2);
    pdf.rect(10, 10, w - 20, h - 20);
    pdf.setLineWidth(0.5);
    pdf.rect(14, 14, w - 28, h - 28);

    // Title
    pdf.setFont("times", "bold");
    pdf.setFontSize(36);
    pdf.setTextColor(30, 58, 95);
    pdf.text("Certificate of Completion", w / 2, 50, { align: "center" });

    // Subtitle
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    pdf.text("This is to certify that", w / 2, 72, { align: "center" });

    // Name
    pdf.setFont("times", "bold");
    pdf.setFontSize(28);
    pdf.setTextColor(30, 58, 95);
    pdf.text(student.fullName, w / 2, 90, { align: "center" });

    // Body
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80);
    pdf.text(`Registration: ${student.regNumber}  |  Department: ${student.department}`, w / 2, 105, { align: "center" });
    pdf.text("has successfully completed the", w / 2, 118, { align: "center" });

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor(30, 58, 95);
    pdf.text("University Awareness Quiz", w / 2, 130, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80);
    pdf.text(`with a score of ${score}/${totalQuestions} (${percentage}%)`, w / 2, 142, { align: "center" });
    pdf.text(`Date: ${today}`, w / 2, 155, { align: "center" });

    // Signature line
    pdf.setDrawColor(30, 58, 95);
    pdf.line(w / 2 - 40, 175, w / 2 + 40, 175);
    pdf.setFontSize(10);
    pdf.text("Authorized Signature", w / 2, 181, { align: "center" });

    pdf.save(`Certificate_${student.fullName.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <Layout>
      <div className="w-full max-w-4xl">
        {/* Preview */}
        <div ref={certRef} className="relative mx-auto mb-6 aspect-[297/210] w-full overflow-hidden rounded-lg border-4 border-primary/20 bg-card p-8 shadow-xl md:p-12">
          <div className="absolute inset-3 rounded border-2 border-primary/10" />
          <div className="relative flex h-full flex-col items-center justify-center text-center">
            <h2 className="mb-2 font-serif text-2xl font-bold text-primary md:text-4xl" style={{ fontFamily: "'Playfair Display', serif" }}>Certificate of Completion</h2>
            <p className="mb-4 text-sm text-muted-foreground">This is to certify that</p>
            <p className="mb-2 font-serif text-xl font-bold text-primary md:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>{student.fullName}</p>
            <p className="mb-4 text-xs text-muted-foreground">Reg: {student.regNumber} &nbsp;|&nbsp; Dept: {student.department}</p>
            <p className="text-sm text-muted-foreground">has successfully completed the</p>
            <p className="mb-2 text-lg font-semibold text-primary">University Awareness Quiz</p>
            <p className="text-sm text-muted-foreground">with a score of {score}/{totalQuestions} ({percentage}%)</p>
            <p className="mt-4 text-xs text-muted-foreground">{today}</p>
            <div className="mt-6">
              <div className="mx-auto w-32 border-t border-primary/40" />
              <p className="mt-1 text-xs text-muted-foreground">Authorized Signature</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" onClick={handleDownload}><Download className="h-4 w-4" /> Download Certificate (PDF)</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Certificate;
