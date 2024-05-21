require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


pool.connect((err, client, release) => {
  if (err) {
      console.error('Error acquiring client', err.stack);
      return;
  }
  console.log('Connected!');
  // client.query('SELECT program_names FROM program_data', (err, result) => {
  //     release(); // Release the client back to the pool
  //     if (err) {
  //         console.error('Error executing query', err.stack);
  //         return;
  //     }

  //     const json_data = result.rows; // Use `result.rows` to get the data directly
  //     console.log("json_table:", json_data);
  // });

  
});



module.exports = pool;
