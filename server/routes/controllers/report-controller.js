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
    const { new_test_time, new_mistakes, test_id } = req.body;

    // Verificăm dacă testul e deja finalizat
    const testCheck = await pool.query('SELECT completed FROM tests WHERE id = $1', [test_id]);
    if (testCheck.rows.length === 0 || !testCheck.rows[0].completed) {
      return res.status(400).json({ message: 'Test not marked as completed yet.' });
    }

    const reportResult = await pool.query('SELECT * FROM reports WHERE user_id = $1', [user_id]);
    if (reportResult.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const report = reportResult.rows[0];
    const updatedTestsCompleted = report.tests_completed + 1;
    const updatedAvgTestTime = (report.avg_test_time * report.tests_completed + new_test_time) / updatedTestsCompleted;
    const updatedMistakesPerTest = (report.mistakes_per_test * report.tests_completed + new_mistakes) / updatedTestsCompleted;
    const updatedTotalTime = report.total_time + new_test_time;

    const totalLessons = parseInt((await pool.query('SELECT COUNT(*) FROM lessons')).rows[0].count);
    const totalTests = parseInt((await pool.query('SELECT COUNT(*) FROM tests')).rows[0].count);
    const totalItems = totalLessons + totalTests;

    const progressPercent = totalItems > 0
      ? ((report.lessons_completed + updatedTestsCompleted) / totalItems) * 100
      : 0;

    await pool.query(`
      UPDATE reports SET
        tests_completed = $1,
        avg_test_time = $2,
        mistakes_per_test = $3,
        total_time = $4,
        progress_percent = $5
      WHERE user_id = $6
    `, [updatedTestsCompleted, updatedAvgTestTime, updatedMistakesPerTest, updatedTotalTime, progressPercent, user_id]);

    res.status(200).json({ message: 'Report updated after test', report: reportResult.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


  const updateAfterLesson = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { new_lesson_time, lesson_id } = req.body;

    // Verificăm dacă lecția e deja finalizată
    const lessonCheck = await pool.query('SELECT completed FROM lessons WHERE id = $1', [lesson_id]);
    if (lessonCheck.rows.length === 0 || !lessonCheck.rows[0].completed) {
      return res.status(400).json({ message: 'Lesson not marked as completed yet.' });
    }

    const reportResult = await pool.query('SELECT * FROM reports WHERE user_id = $1', [user_id]);
    if (reportResult.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const report = reportResult.rows[0];
    const updatedLessonsCompleted = report.lessons_completed + 1;
    const updatedAvgLessonTime = (report.avg_lesson_time * report.lessons_completed + new_lesson_time) / updatedLessonsCompleted;
    const updatedTotalTime = report.total_time + new_lesson_time;

    const totalLessons = parseInt((await pool.query('SELECT COUNT(*) FROM lessons')).rows[0].count);
    const totalTests = parseInt((await pool.query('SELECT COUNT(*) FROM tests')).rows[0].count);
    const totalItems = totalLessons + totalTests;

    const progressPercent = totalItems > 0
      ? ((updatedLessonsCompleted + report.tests_completed) / totalItems) * 100
      : 0;

    await pool.query(`
      UPDATE reports SET
        lessons_completed = $1,
        avg_lesson_time = $2,
        total_time = $3,
        progress_percent = $4
      WHERE user_id = $5
    `, [updatedLessonsCompleted, updatedAvgLessonTime, updatedTotalTime, progressPercent, user_id]);

    res.status(200).json({ message: 'Report updated after lesson', report: reportResult.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


 const updateProgressPercent = async (req, res) => {
  try {
    const { user_id } = req.params;

  
    const totalLessonsResult = await pool.query('SELECT COUNT(*) FROM lessons');
    const totalTestsResult = await pool.query('SELECT COUNT(*) FROM tests');

    const totalLessons = parseInt(totalLessonsResult.rows[0].count);
    const totalTests = parseInt(totalTestsResult.rows[0].count);
    const totalItems = totalLessons + totalTests;

    
    const userReportResult = await pool.query(
      'SELECT lessons_completed, tests_completed FROM reports WHERE user_id = $1',
      [user_id]
    );

    if (userReportResult.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const { lessons_completed, tests_completed } = userReportResult.rows[0];
    const completedItems = lessons_completed + tests_completed;

    const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  
    const updateResult = await pool.query(
      'UPDATE reports SET progress_percent = $1 WHERE user_id = $2 RETURNING *',
      [progress, user_id]
    );

    res.json({
      message: 'Progress percent updated',
      report: updateResult.rows[0]
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
    updateAfterTest,
    updateAfterLesson,
    updateProgressPercent
};
