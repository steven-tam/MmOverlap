// fileName : server.js 
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const app = express()

app.use(cors())
app.use(express.json()) //activates json-parser to make accessing data easy

//   //Fetches data from url. Converts the response into a json object. Prints to console/terminal. 
// let url = 'https://app.coursedog.com/api/v1/cm/' + 'umn_umntc_peoplesoft' + '/programs/'
// fetch(url)
//   .then(res => res.json())
//   .then(data => {
//     console.log(data);
//     allData = data;
//   })


//Writes to db.json with filtered data
async function fetchData() {
  try {
    let url = 'https://app.coursedog.com/api/v1/cm/umn_umntc_peoplesoft/programs/';
    let response = await fetch(url); // Pause until fetch is complete
    let data = await response.json(); // Pause until JSON parsing is complete
    return data; // Return the parsed data
    
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Rethrow the error
  }
}

//This is a helper function that filters json based on the key and values you are looking for. 
//"layerKey" is an optional parameter to handle keys with values in json {"example":{ 'customFields':'Baccalaureate';}}
function filterKey(jsonData, desiredKey, desiredValue, layerKey) { 
  const filteredData = [];
  for (const key in jsonData) { //Enhanced loop for key values in json object
    const obj = jsonData[key]; //returns the value mapped to that key
    if (layerKey != null) { //layerKey is optional
      if (jsonData[key][layerKey][desiredKey] == desiredValue) {
        filteredData.push(obj);
      }
    }
    else{
      if (jsonData[key][desiredKey] == desiredValue) {
        filteredData.push(obj);
      }
    }
  }

  return filteredData;
}

// Use async/await to wait for the fetchData function to complete and then stringify the returned data
(async () => {
  try {
    const data = await fetchData();
    const onlyUndergrad = await filterKey(data, 'cdProgramTypeManual', 'Baccalaureate', 'customFields')
    const jsonData = JSON.stringify(onlyUndergrad);

    // Write the JSON string content to a file named db.json
    fs.writeFile("db.json", jsonData, (error) => {
      // Handle any errors that occur during file writing
      if (error) {
        console.error("Error writing to file:", error);
        throw error;
      }
      
      console.log("Data written to db.json successfully");
    });
  } catch (error) {
    console.error("Error:", error);
  }
})(); //the extra () immediately executes the async function, so we dont have to call it.

  app.get('/', (request, response) => {
  response.send("<h1>Hello World</h1>")
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on http://localhost:${PORT}/`)