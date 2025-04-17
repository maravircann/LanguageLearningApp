import pool from '../../db.js';

const getWordsForFlashcard = async (req, res) => {
  try {
    const { lesson_id } = req.params;

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
  getWordsForFlashcard
};
