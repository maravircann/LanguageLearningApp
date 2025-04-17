import pool from '../../db.js';

const getReportByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (req.user.id !== parseInt(user_id)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
      }
    const result = await pool.query(
      'SELECT * FROM reports WHERE user_id = $1',
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateReport = async (req, res) => {
    try {
      const { user_id } = req.params;
      if (req.user.id !== parseInt(user_id)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
      }
      const {
        lessons_completed,
        tests_completed,
        avg_lesson_time,
        avg_test_time,
        mistakes_per_test,
        total_time
      } = req.body;
  
      
      const totalLessonsResult = await pool.query('SELECT COUNT(*) FROM lessons');
      const totalLessons = parseInt(totalLessonsResult.rows[0].count);
  
      // calcul progres
      const progress_percent = totalLessons > 0 ? (lessons_completed / totalLessons) * 100 : 0;
  
      const result = await pool.query(
        `UPDATE reports SET 
          lessons_completed = $1,
          tests_completed = $2,
          avg_lesson_time = $3,
          avg_test_time = $4,
          mistakes_per_test = $5,
          progress_percent = $6,
          total_time = $7
        WHERE user_id = $8
        RETURNING *`,
        [
          lessons_completed,
          tests_completed,
          avg_lesson_time,
          avg_test_time,
          mistakes_per_test,
          progress_percent,
          total_time,
          user_id
        ]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
   
const resetReport = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      const result = await pool.query(
        `UPDATE reports SET
          lessons_completed = 0,
          tests_completed = 0,
          avg_lesson_time = 0,
          avg_test_time = 0,
          mistakes_per_test = 0,
          progress_percent = 0,
          total_time = 0
        WHERE user_id = $1
        RETURNING *`,
        [user_id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Report not found" });
      }
  
      res.status(200).json({ message: "Report has been reset", report: result.rows[0] });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Server error" });
    }
};
  
const updateAfterTest = async (req, res) => {
    try {
      const { user_id } = req.params;
      const { new_test_time, new_mistakes } = req.body;
  
      // Securizare: utilizatorul poate modifica doar propriul raport
      if (req.user.id !== parseInt(user_id)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
      }
  
      // Obține raportul curent
      const reportResult = await pool.query(
        'SELECT * FROM reports WHERE user_id = $1',
        [user_id]
      );
  
      if (reportResult.rows.length === 0) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      const report = reportResult.rows[0];
  
      const updatedTestsCompleted = report.tests_completed + 1;
  
      const updatedAvgTestTime =
        (report.avg_test_time * report.tests_completed + new_test_time) / updatedTestsCompleted;
  
      const updatedMistakesPerTest =
        (report.mistakes_per_test * report.tests_completed + new_mistakes) / updatedTestsCompleted;
  
      const updatedTotalTime = report.total_time + new_test_time;
  
      const update = await pool.query(
        `UPDATE reports SET 
          tests_completed = $1,
          avg_test_time = $2,
          mistakes_per_test = $3,
          total_time = $4
        WHERE user_id = $5
        RETURNING *`,
        [
          updatedTestsCompleted,
          updatedAvgTestTime,
          updatedMistakesPerTest,
          updatedTotalTime,
          user_id
        ]
      );
  
      res.status(200).json({
        message: 'Report updated after test',
        report: update.rows[0]
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
export default {
  getReportByUserId,
    updateReport,
    resetReport,
    updateAfterTest
};
