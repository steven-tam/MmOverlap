require('dotenv').config();
const express = require('express')
const fs = require('fs')
const cors = require('cors')
const pool = require('../db_connection/db');
const app = express()

app.use(cors())
app.use(express.json()) //activates json-parser to make accessing data easy


process.on('SIGINT', function() {
  pool.end();
  console.log('Application successfully shutdown');
  process.exit(0);
});

app.get('/', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    res.send("<h1>Gopher Major Planner Api</h1>")
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/allMajors', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const sql = "SELECT all_programs FROM program_data"
    pool.query(sql, async (err, result) =>{
    if(err){return (console.log("err in allMajors"))}

    const data = result.rows;
    const json_programs = await data.map(program => {return program.all_programs})

    res.json(json_programs)
  })
  console.log("/api/allMajors success2!")
  } catch (err) {
    
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/programNames', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const sql = "SELECT program_names FROM program_data"
    pool.query(sql, async (err, result) =>{
    if(err){return (console.log("err in programNames"))}

    const data = result.rows;
    const json_programs = await data.map(entry => {return entry.program_names})

    res.json(json_programs)
  })
  console.log("/api/programNames success2!")
  } catch (err) {
    
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/allCourses', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const sql = "SELECT all_courses FROM course_data"
    pool.query(sql, async (err, result) =>{
    if(err){return (console.log("err in allCourses2"))}

    const data = result.rows;
    const json_programs = await data.map(program => {return program.all_courses})

    res.json(json_programs)
  })
  console.log("/api/allCourses success2!")
  } catch (err) {
    
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/courseNames', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const sql = "SELECT course_names FROM course_data"
    pool.query(sql, async (err, result) =>{
    if(err){return (console.log("err in allMajors"))}

    const data = result.rows;
    const json_programs = await data.map(entry => {return entry.course_names})

    res.json(json_programs)
  })
  console.log("/api/courseNames success2!")
  } catch (err) {
    
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT)
console.log(`Server running on http://localhost:${PORT}/`)