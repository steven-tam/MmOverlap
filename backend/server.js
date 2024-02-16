// fileName : server.js 
const express = require('express')
const fs = require('fs')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json()) //activates json-parser to make accessing data easy

const dbFilePath = './data/allMajors.json'
app.get('/', (request, response) => {
  response.send("<h1>Hello World</h1>")
})

app.get('/api/allMajors', (request, response) => {
  // Read the content of db.json file
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading db.json:', err);
      return response.status(500).json({ error: 'Internal Server Error' });
    }
    
    try {
      // Parse the JSON data
      const jsonData = JSON.parse(data);
      // Send the parsed data as JSON response
      response.json(jsonData);
    } catch (parseError) {
      console.error('Error parsing db.json:', parseError);
      response.status(500).json({ error: 'Error parsing JSON data' });
    }
  });
});

const PORT = 3001
app.listen(PORT)
console.log(`Server running on http://localhost:${PORT}/`)