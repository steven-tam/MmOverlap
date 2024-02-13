// fileName : server.js 
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json()) //activates json-parser to make accessing data easy


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on http://localhost:${PORT}/`)