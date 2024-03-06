const express = require('express')
const fs = require('fs')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json()) //activates json-parser to make accessing data easy

const allMajorsPath = './data/allMajors.json'

app.get('/', (request, response) => {
  response.send("<h1>Hello World</h1>")
})

app.get('/api/allMajors', (request, response) => {
  fs.readFile(allMajorsPath, 'utf8', (err, data) => {  // Read the content of allMajors.json
    if (err) {
      console.error('Error reading JSON file:', err);
      return response.status(500).json({ error: 'Internal Server Error' });
    }
    
    try {
      const jsonData = JSON.parse(data); // Parse the JSON data
      response.json(jsonData); // Send response with parsed JSON data
    } catch (parseError) {
      console.error('Error parsing JSON file:', parseError);
      response.status(500).json({ error: 'Error parsing JSON data' });
    }
  });
});

const PORT = 3001
app.listen(PORT)
console.log(`Server running on http://localhost:${PORT}/`)