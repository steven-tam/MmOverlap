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

function calculateCredits(courseIds: string[]){
    var totalCredits = 0 
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
//Inactive but can be used for refactoring
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
    var validCourses: string[] = []
    requirements.forEach((req:any) =>{
        const rules = req['rules']
        const checklistObj: { [key: string]: boolean } = {};

        checklistObj['requirementTitle'] = req["name"];  //Adds titles like "Admission Requirements" or "Program Requirements" to checklist
        
        for(var i in rules){
            const rule = rules[i] // Typically 1 rule
            const condition: string = rule['condition']
            const coreName = rule['name'] //Ex: Major: Astrophysics,  "Mathematics Core", "Statics Core", ect
            const subRules = rule['subRules'] // Array
            const topValues = rule['value'] ? rule['value'] : []
            var countSat = 0 // Tracks if yourCourses satisfies a values[e]
            var numCourses = 0
            var minCredits = 0
            var maxCredits = 0
            var varCredits = 0

            if(subRules.length != 0){ // Chracteristics of Rule type 1: uses subRule, no values
                for(var i in subRules){
                    const subRule = subRules[i]
                    const subName = subRule['name'] ? subRule['name'] : "Unnamed" // Ex: Economics
                    const subCondition = subRule['condition'] // Can be 'completeAllOf' or 'completeAnyOf'
                    const values = subRule['value']['values'] // Ex: [{"logic": "or","value": ["8257721","0099201","0062811","8019831"]}, ...]
                    numCourses = values.length
                    minCredits = subRule.minCredits ? subRule.minCredits : 0;
                    maxCredits = subRule.maxCredits ? subRule.maxCredits : 0;
                    // console.log("subCondition: ", subCondition)
                    
                    for(var e in values){
                        //Ex: values[e] = {"logic": "or","value": ["8257721","0099201","0062811","8019831"]}
                        const logic = values[e].logic
                        const value = values[e].value
                        // console.log("logic:", logic, "value:", value)
    
                        switch(subCondition) {
                            case "completedAnyOf": //Implies OR
                            for(var v of value){ 
                                // console.log("v:", v)
                                if(yourCourses.includes(v)){
                                    console.log("completeAnyOf, or:", true)
                                    validCourses.push(v)
                                    countSat+= 1;
                                    break; //Only 1 course needs to be in value
                                }
                            }
                                break;
                    
                            case "completedAllOf" || "allOf":  //Can be 'or' or 'and'
                                if(logic == "or"){
                                    for(var v of value){ 
                                        if(yourCourses.includes(v)){ //use 'includes()' instead of 'in' for strings
                                            console.log("completeAllOf, or:", true)
                                            validCourses.push(v)
                                            countSat++;
                                            break; //Only 1 course needs to be in value
                                        }
                                    }
                                }
                                else if(logic == "and"){
                                    if(yourCourses.includes(value[0])){
                                        console.log("completeAllOf, and:", true)
                                        validCourses.push(value[0])
                                        countSat++;
                                    }
                                }
                                break;
    
                            case "minimumCredits":
                                var storeCourses: any[] = []
                                var countCd = 0
                                for(var v of value){ 
                                    if(yourCourses.includes(v)){
                                        validCourses.push(v)
                                        storeCourses.push(v)
                                        break; //Only 1 course needs to be in value
                                    }
                                }
                                
                                for (const courseId of validCourses) {
                                    // Match course ID with the courses data
                                    for (const course of allCourses) { // for of statements invokes the Symbol.iterator. Ignore error for now
                                        if (course.id.startsWith(courseId.substring(0, 7))) {
                                            countCd += course.credits.numberOfCredits;
                                            break; // Exit the inner loop after finding the course
                                        }
                                    }
                                }
                                minCredits -= countCd
                                console.log("mC:", minCredits)
                                break;

                            case "completeVariableCoursesAndVariableCredits":
                                var storeCourses = []
                                var countCd = 0
                                if(logic == "or"){
                                    for(var v of value){ 
                                        if(yourCourses.includes(v)){ //use 'includes()' instead of 'in' for strings
                                            validCourses.push(v)
                                            break; //Only 1 course needs to be in value
                                        }
                                    }
                                }
                                else if(logic == "and"){
                                    if(yourCourses.includes(value[0])){
                                        validCourses.push(value[0])
                                    }
                                }
                                varCredits = calculateCredits(storeCourses)
                                console.log("var:", varCredits)
                                break;

                            default: 
                                console.log("Problem In Switch:", subCondition)
                                break;
                        }
                    }
                }
    
                
                console.log("coreName:", coreName)
                console.log("countSat:", countSat)
                console.log("subRules Length:", subRules.length)
                if (countSat == numCourses && minCredits <= 0){
                    console.log("new min-credit:", minCredits)
                    checklistObj[coreName] = true
                }
                else{
                    console.log("coreName:", coreName,"countSat:", countSat, "subRules Length:", subRules.length, "minCredits:", minCredits)
                    checklistObj[coreName] = false
                }
            }
            else if (topValues != 0) { // Chracteristics of Rule type 2: empty subRule, no subCondition, uses value
                const topValues = rule.value
                const tValue = topValues.values
                console.log("topValue:", topValues)
                console.log("tValue:", tValue)
                for(var e in tValue){
                    //Ex: values[e] = {"logic": "or","value": ["8257721","0099201","0062811","8019831"]}
                    const logic = tValue[e].logic
                    const value = tValue[e].value

                    switch(condition) {
                        case "completedAnyOf": //Implies OR
                        for(var v of value){
                            if(yourCourses.includes(v)){
                                validCourses.push(v)
                                countSat+= 1;
                                break; //Only 1 course needs to be in value
                            }
                        }
                            break;
                
                        case "completedAllOf" || "allOf":  //Can be 'or' or 'and'
                            if(logic == "or"){
                                for(var v of value){ 
                                    if(yourCourses.includes(v)){ //use 'includes()' instead of 'in' for strings
                                        validCourses.push(v)
                                        countSat++;
                                        break; //Only 1 course needs to be in value
                                    }
                                }
                            }
                            else if(logic == "and"){
                                if(yourCourses.includes(value[0])){
                                    validCourses.push(value[0])
                                    countSat++;
                                }
                            }
                            break;

                        default: 
                            console.log("Problem In Switch:", condition)
                            break;
                    }
                }
                if (countSat == tValue.length){
                    checklistObj[coreName] = true
                }
                else{
                    checklistObj[coreName] = false
                }
            }
            else{
                console.log("unknown!")
            }
        }
        const currCredits = calculateCredits(validCourses).toString()
        const currCreditsObj = {"curCreditsInProgram": currCredits}
        checklist.push(checklistObj)

    })
    const currCredits = calculateCredits(validCourses).toString()
    const currCreditsObj = {"curCreditsInProgram": currCredits}
    checklist.push(currCreditsObj)
    console.log(validCourses)
    console.log('checkList:', checklist)

    return checklist
}

function checkRequirements(yourProgram: string){
    const getProgramObj = yourProgram != 'Undecided' ? allPrograms.find(p => p.catalogDisplayName == yourProgram): false 
    console.log(yourProgram)
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

function getMostOverlap(){

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