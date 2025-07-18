import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE_NEW,
  password: process.env.PG_PASSWORD,
  port: 5432,
});

export default {
  query: (text, params) => pool.query(text, params),
};
