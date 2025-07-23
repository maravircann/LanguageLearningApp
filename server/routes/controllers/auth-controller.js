import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../../db.js'

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT id, name, email, password, domain_id, created_at FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, domain_id: user.domain_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await pool.query("UPDATE users SET token = $1 WHERE id = $2", [token, user.id]);

    res.status(200).json({
      token,
      id: user.id,
      name: user.name,
      email: user.email,
      domain_id: user.domain_id,
      created_at: user.created_at
    });

  } catch (err) {
    next(err);
  }
};


const logout= async(req, res, next)=>{
    try {
        const {token}=req.body;
        const result=await pool.query("SELECT * FROM users WHERE token = $1 LIMIT 1", [token]);
        const user=result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

    await pool.query("UPDATE users SET token = NULL WHERE id = $1", [user.id]);

    res.status(200).json({ message: 'User logged out' });

    } catch (err) {
        next(err);
    }
}; 


const register = async(req, res, next)=>{
    try {
        console.log("body received",req.body);
        const {name, email, password, domain_id} =req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
          }
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password, token, domain_id) VALUES ($1, $2, $3, NULL, $4) RETURNING id, name, email, domain_id",
            [name, email, hashedPassword, domain_id]
        );

        await pool.query(
            'INSERT INTO reports (user_id) VALUES ($1)',
            [newUser.rows[0].id]
          );

        res.status(201).json(newUser.rows[0]);
       
          
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export default {login, logout, register};