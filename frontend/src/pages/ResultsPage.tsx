import { useEffect, useState } from 'react'
import CompareTab from '../components/CompareTab';
import ChartResults from '../components/ChartResults';
import CoursesData from "../../../jsonGenerator/allCourses.json";
import ProgramData from "../../../backend/data/allMajors.json";


function ResultPage() {
  let program_selected = sessionStorage.getItem("program_selected");
  let courses_selected = sessionStorage.getItem("courses_selected");

  const courses_array = courses_selected != null ? JSON.parse(courses_selected) : [] //Fixes string or null type error when parsing
  const items = [
    {
        title: program_selected, 
        content: (
            <div className='border-2 border-blue-400 rounded-lg p-4'>
                <h1 className='text-3xl text-blue-600'>Title 1</h1>
                <p>
                    sometext
                </p>
            </div>
        )
    },
    {
        title: "Major 2", 
        content: (
            <div className='border-2 border-blue-400 rounded-lg p-4'>
                <h1 className='text-3xl text-blue-600'>Title 2</h1>
                <p>
                    sometext
                </p>
            </div>
        )
    },
    {
        title: "Major 3", 
        content: (
            <div className='border-2 border-blue-400 rounded-lg p-4'>
                <h1 className='text-3xl text-blue-600'>Title 3</h1>
                <p>
                    sometext
                </p>
            </div>
        )
    },
  ]
  var creditCounter = 0;
  console.log("Program Selected:", program_selected)
  console.log("Courses Selected:", courses_array) //Array of course id


  function calculateTotalCredits(courseIds: string[], totalCredits: number){
    totalCredits = 0 // resets counter when you revise your courses
    for (const courseId of courseIds) {
        // Match course ID with the courses data
        for (const course of CoursesData) {
            if (course.id.startsWith(courseId.substring(0, 7))) {
                totalCredits += course.credits.numberOfCredits;
                break; // Exit the inner loop after finding the course
            }
        }
    }


    return totalCredits;
}


return (
  <div> 
    <p>Total Credits: {calculateTotalCredits(courses_array, creditCounter)}</p>
    <ChartResults 
      selectedProgram={program_selected ? program_selected : "Undecided"} 
      selectedCourses={courses_selected ? courses_selected : '[]'}
    />
    <CompareTab tabItems={items}/>
  </div>
)
}


export default ResultPage