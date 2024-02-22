import { useEffect, useState } from 'react'

function CoursePage() {
  //Never mutate states. You always want to set the state to a copy with the changes you want
  const [example, setExample] = useState([{
      "major": "Computer Science B.S",
      "courses": ["001","002","003"]
  },
  {
      "major": "Computer Science B.A",
      "courses": ["001","002","003"]
  },
  {
      "major": "Accounting B.S.B",
      "courses": ["011","022","003"]
  },
  {
      "major": "Biology B.A",
      "courses": ["021","022","023"]
  }
  ])
  return (
    <> 
      <h1>Course Page</h1>
    </>
  )
}

export default CoursePage