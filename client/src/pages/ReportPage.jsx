import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReportPage.css";
import jsPDF from "jspdf";

const ReportPage = () => {
  const [report, setReport] = useState(null);
  const [mlSuggestions, setMlSuggestions] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [predictedLevel, setPredictedLevel] = useState(null);

  const [chartImage, setChartImage] = useState(null);

  
  const fetchMLSuggestions = async (reportData) => {
    try {
      const response = await fetch("http://localhost:5000/api/ml-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          lessons_completed: reportData.lessons_completed || 0,
          tests_completed: reportData.tests_completed || 0,
          avg_lesson_time: reportData.avg_lesson_time || 0,
          avg_test_time: reportData.avg_test_time || 0,
          mistakes_per_test: reportData.mistakes_per_test || 0,
          progress_percent: reportData.progress_percent || 0,
          total_time: reportData.total_time || 0,
        }),
      });

      if (!response.ok) throw new Error("Failed to get ML feedback");
      const data = await response.json();
      console.log("ML feedback primit:", data);
      setMlSuggestions(data.suggestions);
      setPredictedLevel(data.predicted_level);
      setChartImage(data.chart_base64);  // adaugă această linie

    } catch (error) {
      console.error("ML Error:", error);
    }
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/ai-feedback/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch AI report");
        const data = await response.json();
        console.log(" Raport complet primit:", data);

        setReport(data);

        // Apelează sugestiile ML imediat după ce se obține raportul
        fetchMLSuggestions(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (user && token) {
      fetchReport();
    }
  }, [user.id]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Personalized AI Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`User: ${user.name}`, 20, 35);
    doc.text(`Email: ${user.email}`, 20, 42);

    doc.setFontSize(13);
    doc.setTextColor(40, 40, 40);
    doc.text("Summary:", 20, 60);
    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(report.summary, 170), 25, 68);

    doc.setFontSize(13);
    doc.text(`Progress: ${Math.round(report.progress_percent)}%`, 20, 90);

    doc.text("Suggestions:", 20, 105);
    let y = 115;
    report.suggestions.forEach((s) => {
      const lines = doc.splitTextToSize(`• ${s}`, 170);
      doc.text(lines, 25, y);
      y += lines.length * 7;
    });

    if (Array.isArray(mlSuggestions) && mlSuggestions.length > 0) {
      doc.setFontSize(13);
      doc.text("ML Suggestions:", 20, y + 10);
      y += 20;
      mlSuggestions.forEach((s) => {
        const lines = doc.splitTextToSize(`• ${s}`, 170);
        doc.text(lines, 25, y);
        y += lines.length * 7;
      });
    }

    doc.save("AI_Report.pdf");
  };

  if (!report) {
    return <div className="report-loading">Generating AI report...</div>;
  }

  return (
    <div className="report-container">
      <div className="report-card">
        <h1 className="report-title">Personalized AI Report</h1>
        <p className="report-subtitle">Automatically generated based on your activity.</p>

        <div className="report-section">
          <p><strong>Summary:</strong> {report.summary}</p>
          <p><strong>Progress:</strong> <span className="progress-badge">{Math.round(report.progress_percent)}%</span></p>
        </div>

        <div className="report-section">
          <h3 className="section-title">Improvement Suggestions</h3>
          <ul className="suggestion-list">
  {Array.isArray(report?.suggestions) &&
    report.suggestions.map((s, i) => (
      <li key={i}>{s}</li>
    ))}
</ul>

        </div>

        {Array.isArray(mlSuggestions) && mlSuggestions.length > 0 && (
          <div className="report-section">
            <h3 className="section-title">Tips based on your performance</h3>
            {predictedLevel && (
              <p><strong>Estimated level:</strong> {predictedLevel === "low" ? "Beginner" :
                                          predictedLevel === "medium" ? "Intermediate" :
                                          predictedLevel === "high" ? "Advanced" : predictedLevel}</p>
    )}

            <ul className="suggestion-list">
              {mlSuggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {chartImage && (
        <div className="report-section">
          <h3 className="section-title">Progress Analysis</h3>
          <img
            src={`data:image/png;base64,${chartImage}`}
            alt="Grafic generat de AI"
            style={{ maxWidth: "100%", borderRadius: "8px", marginTop: "1rem" }}
          />
        </div>
      )}
        <button className="back-btn" onClick={handleDownloadPDF}> Download PDF</button>
        <button className="back-btn" onClick={() => navigate("/profile")}>← Back to Profile</button>
      </div>
    </div>
  );
};

export default ReportPage;
