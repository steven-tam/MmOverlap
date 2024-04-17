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

function validateCourses(subRuleArray:any){
    //This function checks if yourCourses meets the subRules of a Core
    for(var i in subRuleArray){
        const subCondition = subRuleArray[i]["condition"]
        switch(subCondition) {
            case "allOf":
                // if(subRule) { //if subRule exists
                //     var countRules = 0;
                //     subRule.forEach((sr:any) => {
                //         const subRuleValues = sr['value']['values'] //Ex: [{"logic": "or","value": ["8257721","0099201",]}]
                //         for(const i in subRuleValues){
                //             const logic = subRuleValues[i]['logic']
                //             const coursesInValue = subRuleValues[i]['value']
                //         }
                     
                //     })
                //     }
    
                console.log(subCondition)
                break;
    
            case "anyOf":
                console.log(subCondition)
                break;
    
            case "completedAnyOf":
                console.log(subCondition)
                break;
    
            case "completedAllOf":
                console.log(subCondition)
                break;
    
            case "minimumCredits":
                console.log(subCondition)
                break;

            default: 
                return false
        }
    } 
    return false
}

function createChecklist(requirements: any, yourCourses: string[]){
    const checklist: any[] = [];

    requirements.forEach((req:any) =>{
        const requisites = req['rules']
        const checklistObj: { [key: string]: boolean } = {};

        checklistObj['requirementTitle'] = req["name"];  //Adds titles like "Admission Requirements" or "Program Requirements" to checklist
        for(var i in requisites){
            const rules = requisites[i]
            const condition: string = rules['condition']
            const subRule = rules['subRules'] //note: some elements in rules have empty subRule
            const coreName = rules['name'] //Ex: "Mathematics Core", "Statics Core", ect
    
            switch(condition) {
                case "allOf":
                    if (validateCourses(subRule)){
                        checklistObj[coreName] = true;
                    }
                    
                    console.log(condition)
                    break;

                case "anyOf":
                    if(subRule) { //if subRule exists

                    }
                    console.log(condition)
                    break;
    
                case "completedAnyOf":
                    console.log(condition)
                    break;

                case "completedAllOf":
                    console.log(condition)
                    break;

                case "minimumCredits":
                    console.log(condition)
                    break;

                default:
                    checklistObj[coreName] = false; //Add coreNames to checklist
            }
        }
        checklist.push(checklistObj)
    })
    console.log('checkList:', checklist)

    return checklist
}

function checkRequirements(yourProgram: string){
    const getProgramObj = yourProgram != 'Undecided' ? programDataTyped.find(p => p.catalogDisplayName == yourProgram): false 

    if (getProgramObj){
        const requirements = getProgramObj['requisites']['requisitesSimple'] // type ex: [{...},{...}]
        // const getProgramRequirements = requirements.find((req: any) => req.name == "Program Requirements");
        const programChecklist = createChecklist(requirements, yourCourses)

        // console.log('getProgramRequirements:', getProgramRequirements);// var reqChecklist: {[key: string]: boolean; }[] = createChecklist(getProgramRequirements, yourCourses) // ex: [{"reqTitle": "Admission Requirement", "Mathematics Core": false, "Statics Core": false, ect}, {...}]
     
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