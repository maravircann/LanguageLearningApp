import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReportPage.css"; // creezi dacă vrei stil personalizat
import jsPDF from "jspdf";

const ReportPage = () => {
  const [report, setReport] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/ai-feedback/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Eroare la preluarea raportului");
        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error("Eroare:", error);
      }
    };

    if (user && token) fetchReport();
  }, [user.id]);


  
  const handleDownloadPDF = () => {
  const doc = new jsPDF();
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(16);
  doc.text("📊 Raport AI Personalizat", 20, 20);

  doc.setFontSize(12);
  doc.text(`Nume utilizator: ${user.name}`, 20, 35);
  doc.text(`Email: ${user.email}`, 20, 42);

  doc.setFontSize(13);
  doc.setTextColor(40, 40, 40);
  doc.text("Rezumat:", 20, 60);
  doc.setFontSize(12);
  doc.text(doc.splitTextToSize(report.summary, 170), 25, 68);

  doc.setFontSize(13);
  doc.text(`Procent progres: ${Math.round(report.progress_percent)}%`, 20, 90);

  doc.setFontSize(13);
  doc.text("Sugestii pentru îmbunătățire:", 20, 105);

  let y = 115;
  doc.setFontSize(12);
  report.suggestions.forEach((sugestie) => {
    const lines = doc.splitTextToSize(`• ${sugestie}`, 170);
    doc.text(lines, 25, y);
    y += lines.length * 7;
  });

  doc.save("raport_AI.pdf");
};


  if (!report) {
    return <div className="report-loading">Se generează raportul AI...</div>;
  }

  return (
    <div className="report-container">
      <div className="report-card">
        <h1 className="report-title">📊 Raport AI personalizat</h1>
        <p className="report-subtitle">Analiză automată bazată pe activitatea ta din aplicație.</p>

        <div className="report-section">
          <p><strong>📝 Rezumat:</strong> {report.summary}</p>
          <p><strong>📈 Procent progres:</strong> 
            <span className="progress-badge">{Math.round(report.progress_percent)}%</span>
          </p>
        </div>

        <div className="report-section">
          <h3 className="section-title">💡 Sugestii pentru îmbunătățire</h3>
          <ul className="suggestion-list">
            {report.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <button className="back-btn" onClick={handleDownloadPDF}>
            ⬇️ Descarcă PDF
          </button>
        <button className="back-btn" onClick={() => navigate("/profile")}>
          ← Înapoi la profil
        </button>

      </div>
    </div>
  );
};

export default ReportPage;
