import { useEffect, useState } from 'react'

function ResultPage() {
  let program_selected = sessionStorage.getItem("program_selected");
  let courses_selected = sessionStorage.getItem("courses_selected");
  console.log("Program Selected:", program_selected)
  console.log("Courses Selected:", courses_selected)
  
return (
  <div> 
    <h1>Results/Analysis Page</h1>
  
  </div>
)
}


export default ResultPage