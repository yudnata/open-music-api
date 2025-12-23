const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

pool.connect()
  .then(() => {
    console.log(`Database connected → ${process.env.PGDATABASE}`);
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
  });

module.exports = pool;
