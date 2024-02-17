import { useEffect, useState } from 'react'

function CoursePage() {
  const [programs, setPrograms] = useState([
    {
        "major": "Computer Science B.S",
        "prerequisite": [
            "001",
            "171",
            "262"
        ]
    },
    {
        "major": "Computer Science B.A",
        "prerequisite": [
            "001",
            "171",
            "262"
        ]
    },
    {
        "major": "Accounting B.S.B",
        "prerequisite": ["003","161","632"]
    },
    {
        "major": "Biology B.A",
        "prerequisite": ["004","161","262"]
    }
])

  return (
    <> 
      <ul>
        {programs.map(e => <li>{e["major"]}</li>)}
      </ul>
      <h1>Course Page</h1>
    </>
  )
}

export default CoursePage