import { useEffect, useState } from 'react'
import './App.css'



function App() {
  const [newMajor, setNewMajor] = useState('') //useState() is fundamental to React
  const [newMinor, setNewMinor] = useState('')
  const [majors, setMajors] = useState<string[]>([]) //"<string[]>" is typescript
  const [minors, setMinors] = useState<string[]>([])
  const [allData, setAllData] = useState([])


//Method 1 for defining a function (regular function)
  function handleMajorChange (event: any){ //": any" is typescript
    /*
    handleMajorChange is linked to the onChange attribute in the html input tag.
    Consider event.target.value, the event here is when we type something into the 
    input. target.value is syntax that tells the computer to hold whatever is
    typed in input.
    */
    setNewMajor(event.target.value) 
    console.log(newMajor) //If you open developer tool, for me the shortcut is ctrl + shift + j, 
    //you will see whats happening
  }
  function handleMinorChange (event: any){
    setNewMinor(event.target.value)
    console.log(newMinor)
  }
//Method 2 of defining a function (arrow function)
  const addMajor = (event: any) => {
    event.preventDefault();
    setMajors([...majors, newMajor]); // "...major" creates a copy of what we currently have stored in majors
    setNewMajor(''); //clears input after submit
    console.log(majors)
  };

  const addMinor = (event: any) => {
    event.preventDefault();
    setMinors([...minors, newMinor]);
    setNewMinor('');
    console.log(minors)
  };

  //Use curly braces to write javascript to a html tag.
  //The built-in map function returns a copy of your array after modifications
  //For example, [1, 2, 3].map(e => e + 1) returns [2, 3, 4].
  return (
    <> 
      <h1>Hello World</h1>
      <table className="container">
        <tr>
          <th>Majors</th>
          <th>Minors</th>
        </tr>

        <tr>
          <td>
            <ul>
              {majors.map(major => <li>{major}</li>)} 
            </ul>
          </td>
        </tr>

        <tr>
          <td>
            <ul>
              {minors.map(minor => <li>{minor}</li>)}
            </ul>
          </td>
        </tr>
      </table>
  
      <form onSubmit={addMajor}>
        <div > 
          <label htmlFor="majorInput">Add a Major: </label>
          <input value={newMajor} onChange={handleMajorChange} id="majorInput" />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <form onSubmit={addMinor}>
        <div>
            <label htmlFor="minorInput">Add a Major: </label>
            <input value={newMinor} onChange={handleMinorChange} id="minorInput" />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

    </>
  )
}

export default App
