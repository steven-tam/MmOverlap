require('dotenv').config();
const express = require('express')
const fs = require('fs')
const cors = require('cors')
const pool = require('../db_connection/db');
const app = express()

app.use(cors())
app.use(express.json()) //activates json-parser to make accessing data easy


app.get('/', (req, res) => {
  try {
    res.send("<h1>Gopher Major Planner Api</h1>")
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/allMajors', async (req, res) => {
  try {
    const sql = "SELECT all_programs FROM program_data"
    pool.query(sql, async (err, result) =>{
    if(err){return (console.log("err in allMajors"))}

    const data = result.rows;
    const json_programs = await data.map(program => {return program.all_programs})

    res.json(json_programs)
  })
  console.log("/api/allMajors success!")
  } catch (err) {
    
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/programNames', async (req, res) => {
  try {
    const sql = "SELECT program_names FROM program_data"
    pool.query(sql, async (err, result) =>{
    if(err){return (console.log("err in programNames"))}

    const data = result.rows;
    const json_programs = await data.map(entry => {return entry.program_names})

    res.json(json_programs)
  })
  console.log("/api/programNames success!")
  } catch (err) {
    
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/allCourses', async (req, res) => {
  try {
    const sql = "SELECT all_courses FROM course_data"
    pool.query(sql, async (err, result) =>{
    if(err){return (console.log("err in allCourses"))}

    const data = result.rows;
    const json_programs = await data.map(program => {return program.all_courses})

    res.json(json_programs)
  })
  console.log("/api/allCourses success!")
  } catch (err) {
    
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/courseNames', async (req, res) => {
  try {
    const sql = "SELECT course_names FROM course_data"
    pool.query(sql, async (err, result) =>{
    if(err){return (console.log("err in allMajors"))}

    const data = result.rows;
    const json_programs = await data.map(entry => {return entry.course_names})

    res.json(json_programs)
  })
  console.log("/api/courseNames success!")
  } catch (err) {
    
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT)
console.log(`Server running on http://localhost:${PORT}/`)