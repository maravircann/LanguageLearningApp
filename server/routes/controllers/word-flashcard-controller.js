import pool from '../../db.js';

const getWordsForFlashcard = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT id, word FROM words WHERE lesson_id = $1',
      [id]
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
