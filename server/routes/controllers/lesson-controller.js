import pool from '../../db.js';
import e from 'express';

const getAllLessons = async (req, res) => {
  try {
    const { domain_id } = req.query;

    let query = 'SELECT * FROM lessons';
    const params = [];

    if (domain_id) {
      query += ' WHERE domain_id = $1';
      params.push(domain_id);
    }

    query += ' ORDER BY id ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await pool.query('SELECT * FROM lessons WHERE id = $1', [id]);

    if (lesson.rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json(lesson.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const completeLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, new_lesson_time } = req.body;

    const checkLesson = await pool.query('SELECT completed FROM lessons WHERE id = $1', [id]);
    if (checkLesson.rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (checkLesson.rows[0].completed) {
      return res.status(200).json({ message: 'Lesson already completed' });
    }

    const updateLesson = await pool.query('UPDATE lessons SET completed = TRUE WHERE id = $1 RETURNING *', [id]);

    const reportResult = await pool.query('SELECT * FROM reports WHERE user_id = $1', [userId]);
    if (reportResult.rows.length > 0) {
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
      `, [updatedLessonsCompleted, updatedAvgLessonTime, updatedTotalTime, progressPercent, userId]);
    }

    res.json({ message: 'Lesson marked as completed', lesson: updateLesson.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};



export default {
  getAllLessons,
  getLessonById,
  completeLesson
};
