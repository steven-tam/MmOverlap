import { useEffect, useState } from 'react'
import ChartResults from '../components/ChartResults';

import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  BarElement, CategoryScale, LinearScale, Tooltip, Legend 
)

function ResultPage() {
  let program_selected = sessionStorage.getItem("program_selected");
  let courses_selected = sessionStorage.getItem("courses_selected");
  console.log("Program Selected:", program_selected)
  console.log("Courses Selected:", courses_selected)


return (
  <div> 
    <ChartResults 
      selectedProgram={program_selected ? program_selected : "Undecided"} 
      selectedCourses={courses_selected ? courses_selected : '[]'}
    />
  </div>
)
}


export default ResultPage