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

export default {
  getAllTests,
  getTestById
};
