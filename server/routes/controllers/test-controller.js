import pool from '../../db.js';
import e from 'express';

const getAllTests = async (req, res) => {
  try {
    const { domain_id } = req.query;

    let query = 'SELECT * FROM tests'; 
    const params = [];

    if (domain_id) {
      query += ' WHERE domain_id = $1';
      params.push(domain_id);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const test = await pool.query('SELECT * FROM tests WHERE id = $1', [id]);

    if (test.rows.length === 0) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.json(test.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const completeTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, new_test_time, mistakes } = req.body;

    // Verificăm dacă testul există și dacă e deja completat
    const checkTest = await pool.query('SELECT completed FROM tests WHERE id = $1', [id]);
    if (checkTest.rows.length === 0) {
      return res.status(404).json({ message: 'Test not found' });
    }

    if (checkTest.rows[0].completed) {
      return res.status(200).json({ message: 'Test already completed' });
    }

    // Marchează testul ca finalizat
    const updateTest = await pool.query(
      'UPDATE tests SET completed = TRUE WHERE id = $1 RETURNING *',
      [id]
    );

    // Actualizăm raportul doar dacă testul nu era deja completat
    const reportResult = await pool.query('SELECT * FROM reports WHERE user_id = $1', [userId]);
    if (reportResult.rows.length > 0) {
      const report = reportResult.rows[0];

      // Crește nr. de teste completate cu 1
      const updatedTestsCompleted = report.tests_completed + 1;

      // Calculăm media timpului și greșelilor
      const updatedAvgTestTime = (report.avg_test_time * report.tests_completed + new_test_time) / updatedTestsCompleted;
      const updatedMistakesPerTest = (report.mistakes_per_test * report.tests_completed + mistakes) / updatedTestsCompleted;

      // Adăugăm timpul total
      const updatedTotalTime = report.total_time + new_test_time;

      // Obținem totalul de lecții și teste pentru progres
      const totalLessons = parseInt((await pool.query('SELECT COUNT(*) FROM lessons')).rows[0].count);
      const totalTests = parseInt((await pool.query('SELECT COUNT(*) FROM tests')).rows[0].count);
      const totalItems = totalLessons + totalTests;

      const progressPercent = totalItems > 0
        ? ((report.lessons_completed + updatedTestsCompleted) / totalItems) * 100
        : 0;

      // Actualizăm raportul în DB
      await pool.query(`
        UPDATE reports SET
          tests_completed = $1,
          avg_test_time = $2,
          mistakes_per_test = $3,
          total_time = $4,
          progress_percent = $5
        WHERE user_id = $6
      `, [
        updatedTestsCompleted,
        updatedAvgTestTime,
        updatedMistakesPerTest,
        updatedTotalTime,
        progressPercent,
        userId
      ]);
    }

    res.json({ message: 'Test marked as completed', test: updateTest.rows[0] });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


export default {
  getAllTests,
  getTestById,
  completeTest
};
