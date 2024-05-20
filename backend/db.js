const { Pool } = require('pg');

const pool = new Pool({
  user: 'steven',
  host: 'localhost',
  database: 'major_database',
  password: 'Z1uw2c5vph',
  port: 5432,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log(result.rows);
  });
});

module.exports = pool;
