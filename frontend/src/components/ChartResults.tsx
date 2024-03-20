import React from 'react'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
    BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title
  )

type props = {
    selectedProgram: string;
    selectedCourses: string;
}

function ChartResults({selectedProgram, selectedCourses}: props) {
    const arrayCourses = JSON.parse(selectedCourses)
    console.log("Program Selected in ChartResults:", selectedProgram)
    console.log("Courses Selected in ChartResults:", arrayCourses)

    // legend: {
    //     position: 'right' as const,
    // }
    
    const options = { 
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        plugins: {
            title: {
                display: true,
                text: 'Your Progress',
            },
        },
    };

    const data = { //Replace months with majors
        labels: ['January', 'February', 'March', 'April'] ,
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
    <div className="w-full aspect-video mx-auto border-4 rounded-lg">
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
