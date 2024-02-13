// fileName : server.js 
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json()) //activates json-parser to make accessing data easy


//For Referencing
  // function exportDogs() {
  //   const schoolId = 'umn_umntc_peoplesoft'
  //   let subject = ''
  //   let subjectCode = (subject == 'allCourses') ? '' : 'subjectCode=' + subject
  //   let fileName = subject + '.json'
  //   let filePath = './Dog/'
  //   // let filePath = './'
  //   let returnFields = '&returnFields=subjectCode,courseNumber,name,description' // preq is at the end of description
  //   let limit = '&limit=infinity'


  //Fetches data from url. Converts the response into a json object. Prints to console
let url = 'https://app.coursedog.com/api/v1/cm/' + 'umn_umntc_peoplesoft' + '/programs/'
fetch(url)
  .then(res => res.json())
  .then(data => console.log(data))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on http://localhost:${PORT}/`)