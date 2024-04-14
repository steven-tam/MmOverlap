import { useEffect, useState } from 'react'
import CompareTab from '../components/CompareTab';
import ChartResults from '../components/ChartResults';
import CoursesData from "../../../jsonGenerator/allCourses.json";
import ProgramData from "../../../jsonGenerator/allMajors.json";

type Program = {
    id: number; // Index in search bar, see handleProgramClick / handleKeyDown
    catalogDisplayName: string;
    requisites: any;
  };

type Course = {
    id: string;
    code: string;
    longName: string;
    credits: {
        numberOfCredits: number;
    };
};


function ResultPage() {
  let program_selected = sessionStorage.getItem("program_selected");
  let courses_selected = sessionStorage.getItem("courses_selected");
  const yourCourses = courses_selected != null ? JSON.parse(courses_selected) : [] //Fixes string or null type error when parsing
  const yourProgram = program_selected != null ? program_selected : "Undecided"
  const programDataTyped = ProgramData as Program[] //type casts programData
  const coursesDataTyped = CoursesData as Course[] //type casts coursesData
  var creditCounter = 0;
  const itemsTab = [
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
  
  console.log("Program Selected:", yourProgram)
  console.log("Courses Selected:", yourCourses) //Array of course id

  function calculateTotalCredits(courseIds: string[], totalCredits: number){
    totalCredits = 0 // resets counter when you revise your courses
    for (const courseId of courseIds) {
        // Match course ID with the courses data
        for (const course of CoursesData) { // for of statements invokes the Symbol.iterator. Ignore error for now
            if (course.id.startsWith(courseId.substring(0, 7))) {
                totalCredits += course.credits.numberOfCredits;
                break; // Exit the inner loop after finding the course
            }
        }
    }
    return totalCredits;
}

function createChecklist(programRequirements: any, yourCourses: string[]){
    const checklist: { [key: string]: boolean } = {};
    const rules = programRequirements['rules']

    for(var i in rules){
        const condition: string = rules[i]['condition']
        const subRule = rules[i]['subRules'] //note: some elements in rules have empty subRule
        const coreName = rules[i]['name'] //Ex: "Mathematics Core", "Statics Core", ect
        
        switch(condition) {
            case "allOf":
                console.log(condition)
                break;

            case "completedAnyOf":
                console.log(condition)
                break;

        }
            
        checklist[coreName] = false;
    }

    console.log('checkList:', checklist)

    return checklist
}

function checkRequirements(yourProgram: string){
    const getProgramObj = yourProgram != 'Undecided' ? programDataTyped.find(p => p.catalogDisplayName == yourProgram): false 

    if (getProgramObj){
        const requirements = getProgramObj['requisites']['requisitesSimple'] // type ex: [{...},{...}]
        const getProgramRequirements = requirements.find((req: any) => req.name == "Program Requirements");
        const programChecklist = createChecklist(getProgramRequirements, yourCourses)

        console.log('getProgramRequirements:', getProgramRequirements);// var reqChecklist: {[key: string]: boolean; }[] = createChecklist(getProgramRequirements, yourCourses) // ex: [{"reqTitle": "Admission Requirement", "Mathematics Core": false, "Statics Core": false, ect}, {...}]
        console.log('programChecklist:', programChecklist)
    }
    else{
        console.log("Your Major is Undecided")
    }

}


checkRequirements(yourProgram)

return (
  <div> 
    <p>Total Credits: {calculateTotalCredits(yourCourses, creditCounter)}</p>
    <ChartResults 
      selectedProgram={yourProgram} 
      selectedCourses={yourCourses}
    />
    <CompareTab tabItems={itemsTab}/>
  </div>
)
}


export default ResultPage