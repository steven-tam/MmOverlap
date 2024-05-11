import { useEffect, useState } from 'react'
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

const data = [
    {
      label: "HTML",
      value: "html",
      desc: `It really matters and then like it really doesn't matter.
      What matters is the people who are sparked by it. And the people 
      who are like offended by it, it doesn't matter.`,
    },
    {
      label: "React",
      value: "react",
      desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
    },
    {
      label: "Vue",
      value: "vue",
      desc: `We're not always in the position that we want to be at.
      We're constantly growing. We're constantly making mistakes. We're
      constantly trying to express ourselves and actualize our dreams.`,
    },
    {
      label: "Angular",
      value: "angular",
      desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
    },
    {
      label: "Svelte",
      value: "svelte",
      desc: `We're not always in the position that we want to be at.
      We're constantly growing. We're constantly making mistakes. We're
      constantly trying to express ourselves and actualize our dreams.`,
    },
  ];



function ResultPage() {
  let program_selected = sessionStorage.getItem("program_selected");
  let courses_selected = sessionStorage.getItem("courses_selected");
  const yourCourses = courses_selected != null ? JSON.parse(courses_selected) : [] //Fixes string or null type error when parsing
  const yourProgram = program_selected != null ? program_selected : "Undecided"
  const allPrograms = ProgramData as Program[] //type casts programData
  const allCourses = CoursesData as Course[] //type casts coursesData
  var creditCounter = 0;
  
  console.log("Program Selected:", yourProgram)
  console.log("Courses Selected:", yourCourses) //Array of course id

  function calculateTotalCredits(courseIds: string[], totalCredits: number){
    totalCredits = 0 // resets counter when you revise your courses
    for (const courseId of courseIds) {
        // Match course ID with the courses data
        for (const course of allCourses) { // for of statements invokes the Symbol.iterator. Ignore error for now
            if (course.id.startsWith(courseId.substring(0, 7))) {
                totalCredits += course.credits.numberOfCredits;
                break; // Exit the inner loop after finding the course
            }
        }
    }
    return totalCredits;
}

//Inactive but will be used for refactoring
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
            const coreName = rules['name'] //Ex: Major: Astrophysics,  "Mathematics Core", "Statics Core", ect
            const subRules = rules['subRules'] // Array
            const coreStatus = false


            for(var i in subRules){
                const subRule = subRules[i]
                const subName = subRule['name'] ? subRule['name'] : "Unnamed" // Ex: Economics
                const subCondition = subRule['condition']
                const courseArray = subRule['value']['values'] // Ex: [{"logic": "or","value": ["8257721","0099201","0062811","8019831"]}, ...]
        
                const status = false;
                console.log("subRule: ", subCondition)
                console.log("courseArray: ", courseArray)

                for(var e in courseArray){
                    const logic = courseArray[e].logic
                    const value = courseArray[e].value
                    
                    console.log("logic:", logic)
                    console.log("value:", value)


                }

              
               
            }

            switch(condition) { 
                case "allOf":
                    console.log(condition)
                    break;
        
                case "anyOf":
                    console.log(condition)
                    break;
        
                case "minimumCredits":
                    console.log(condition)
                    break;
    
                default: 
                    return false
            }

            checklistObj[coreName] = coreStatus

        }
        checklist.push(checklistObj)
    })
    console.log('checkList:', checklist)

    return checklist
}

function checkRequirements(yourProgram: string){
    const getProgramObj = yourProgram != 'Undecided' ? allPrograms.find(p => p.catalogDisplayName == yourProgram): false 

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
  </div>
)
}


export default ResultPage