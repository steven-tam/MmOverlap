const express = require('express')
const cors = require('cors')
const fs = require('fs')
const app = express()

app.use(cors())
app.use(express.json()) //activates json-parser to make accessing data easy

//To run this script type: npm run createdb
//Take a look at package.json for the current scripts in the backend.

//This is a helper function that filters json based on the key and values you are looking for. 
//"layerKey" is an optional parameter to handle keys with json values 
// {"example":{ 'customFields':'Baccalaureate';}}
function filterKey(jsonData, desiredKey, desiredValue, layerKey) { 
  const filteredData = [];
  for (const key in jsonData) { //Enhanced loop for key values in json object
    const obj = jsonData[key]; //returns the value mapped to that key
    if (layerKey == null) {   //layerKey is optional
      if (jsonData[key][desiredKey] == desiredValue) {
        filteredData.push(obj);
      }
    }
    else{
      if (jsonData[key][layerKey][desiredKey] == desiredValue) {
        filteredData.push(obj);
      }
    }
  }

  return filteredData;
}

// async/await is necessary because the data returned by fetchData() and filterKey() is too big
(async () => {
  console.log("Writing database...")
  try {
    let url = 'https://app.coursedog.com/api/v1/cm/umn_umntc_peoplesoft/programs/';
    const data = await fetch(url).then(response => response.json()); // Waits for fetch() to complete. Parses that data into JSON
    const allMajors = await filterKey(data, 'cdProgramTypeManual', 'Baccalaureate', 'customFields') // Waits for filterKey to complete
    const jsonData = JSON.stringify(allMajors);

    // Write the JSON string content to a file named db.json
    fs.writeFile("db.json", jsonData, (error) => {
      // Handle any errors that occur during file writing
      if (error) {
        console.error("Error writing to file:", error);
        throw error;
      }
      
      console.log("Data successfully written to db.json");
    });
  } catch (error) {
    console.error("Error:", error);
  }
})(); //This is an immediately-invoked asynchronous function expression (IIFE)
