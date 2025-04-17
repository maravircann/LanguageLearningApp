import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: "postgres",
    password: "stef2003ania",
    host: "localhost",
    port: 5432,
    database: "langlearn"
});

export default pool;
