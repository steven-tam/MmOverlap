import React from 'react'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
    BarElement, CategoryScale, LinearScale, Tooltip, Legend 
  )

type props = {
    selectedProgram: string;
    selectedCourses: string;
}

function ChartResults({selectedProgram, selectedCourses}: props) {
    const arrayCourses = JSON.parse(selectedCourses)
    console.log("Program Selected in ChartResults:", selectedProgram)
    console.log("Courses Selected in ChartResults:", arrayCourses)
    
    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'right' as const,
            },
            title: {
                display: true,
                text: 'Chart.js Horizontal Bar Chart',
            },
        },
    };

    const labels = ['January', 'February', 'March', 'April'];

    const data = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: [3,2,1],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };
    
  return (
    <div>
      <Bar 
        style = {{
            padding: '20px', 
        }}
        data = {data}
        options = {options}
      />
    </div>
  )
}

export default ChartResults
