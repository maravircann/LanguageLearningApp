import pool from '../../db.js';

const getWordsByLessonId = async (req, res) => {
  try {
    const { lesson_id } = req.query;

    if (!lesson_id) {
      return res.status(400).json({ message: 'Missing lesson_id' });
    }

    const result = await pool.query(
      'SELECT * FROM words WHERE lesson_id = $1',
      [lesson_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  getWordsByLessonId
};
