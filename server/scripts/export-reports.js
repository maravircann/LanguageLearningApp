import fs from "fs";
import pool from '../db.js';

const exportReports = async () => {
  try {
    const result = await pool.query("SELECT * FROM reports");

    const csvHeader = "user_id,lessons_completed,tests_completed,avg_lesson_time,avg_test_time,mistakes_per_test,progress_percent,total_time\n";
    const csvRows = result.rows.map(r =>
      `${r.user_id},${r.lessons_completed},${r.tests_completed},${r.avg_lesson_time},${r.avg_test_time},${r.mistakes_per_test},${r.progress_percent},${r.total_time}`
    );

    fs.writeFileSync("rapoarte.csv", csvHeader + csvRows.join("\n"));
    console.log(" Export complet! Fișierul salvat: rapoarte.csv");
  } catch (err) {
    console.error(" Eroare la export:", err);
  } finally {
    process.exit();
  }
};

exportReports();
