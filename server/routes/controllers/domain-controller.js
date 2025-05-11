import pool from '../../db.js';

const getDomainById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM domains WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Domain not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  getDomainById
  
};