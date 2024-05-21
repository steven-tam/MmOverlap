const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: 'steven',
  host: 'localhost',
  database: 'moverlap_database',
  password: 'Z1uw2c5vph',
  port: 5432,
});

const allMajorsDirectory = 'data/allMajors.json'
const allCoursesDirectory = 'data/allCourses.json'

const insertAllMajors = async (dataArray) => {
  const client = await pool.connect();
  for (const obj of dataArray) {
      const name = obj.catalogDisplayName
      const query = {
          text: 'INSERT INTO program_data(all_programs, program_names) VALUES($1, $2)',
          values: [obj, name] // Wrap the object in an array
      };

      const res = await client.query(query);
  }
  console.log("program_data success!")
}

const insertAllCourses = async (dataArray) => {
  const client = await pool.connect();
  for (const obj of dataArray) {
      const name = obj.code
      const query = {
          text: 'INSERT INTO course_data(all_courses, course_names) VALUES($1,$2)',
          values: [obj, name] // Wrap the object in an array
      };

      const res = await client.query(query);
  }
  console.log("course_data success!")
}

pool.connect((err, client, release) => {
  if (err) {
      console.error('Error acquiring client', err.stack);
      return;
  }
  console.log('Connected!');
  client.query('SELECT program_names FROM program_data', (err, result) => {
      release(); // Release the client back to the pool
      if (err) {
          console.error('Error executing query', err.stack);
          return;
      }

      const json_data = result.rows; // Use `result.rows` to get the data directly
      console.log("json_table:", json_data);
  });


  // fs.readFile(allMajorsDirectory, 'utf8', (err, data) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }
  //   const dataArray = JSON.parse(data)
    
  //   insertAllMajors(dataArray)
  // })

  // fs.readFile(allCoursesDirectory, 'utf8', (err, data) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }
  //   const dataArray = JSON.parse(data)

  //   insertAllCourses(dataArray)
  // })
  
});



// module.exports = pool;
