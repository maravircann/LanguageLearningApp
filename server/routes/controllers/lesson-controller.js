import e from 'express';
import pool from '../../db.js';

const getAllLessons = async (req, res) => {
  try {
    const { domain_id } = req.query;

    let query = 'SELECT * FROM lessons';
    const params = [];

    if (domain_id) {
      query += ' WHERE domain_id = $1';
      params.push(domain_id);
    }

    
    query += params.length > 0 ? ' ORDER BY id ASC' : ' ORDER BY id ASC';

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

    const updateQuery = 'UPDATE lessons SET completed = TRUE WHERE id = $1 RETURNING *';
    const result = await pool.query(updateQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    res.json({ message: 'Lesson marked as completed', lesson: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
export default{ getAllLessons, getLessonById, completeLesson };