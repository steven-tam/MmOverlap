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

function createChecklist(requirements: any, yourCourses: string[]){
    const checklist: any[] = [];
    var validCourses: string[] = []
    
    requirements.forEach((req:any) =>{
        const rules = req['rules']
        const checklistObj: { [key: string]: any[] } = {};

        checklistObj['requirementTitle'] = req["name"];  //Adds titles like "Admission Requirements" or "Program Requirements" to checklist
        
        for(var i in rules){
            // Chracteristics of Rule TYPE 1: uses subRule, no values, conditions: ["allOf", "anyOf"]
            // Chracteristics of Rule TYPE 2: empty subRule, uses value, conditions: ["completedAllOf", "completedAnyOf", "completeVariableCoursesAndVariableCredits", "minimumCredits", "completedAtLeastXOf"]
            const rule = rules[i]
            const condition: string = rule['condition'] // Can be Rule TYPE 1 or TYPe 2
            const coreName = rule['name'] //Ex: Major: Astrophysics,  "Mathematics Core", "Statics Core", ect

            const subRules = rule['subRules'] // Used for type 1
            const topValues = rule['value'] ? rule['value'] : [] // Used for TYPE 2

            // Used in "completeVariableCoursesAndVariableCredits" and "completedAtLeastXOf"
            var minCredits = rule.minCredits ? rule.minCredits : null;
            var maxCredits = rule.maxCredits ? rule.maxCredits : null;
            var minCourses = rule.minCourses ? rule.minCourses : null;
            var maxCourses = rule.maxCourses ? rule.maxCourses : null;
            

            if(condition.includes("allOf")){ // Condition for handling type 1
                var countSat = 0 // Tracks if yourCourses satisfies a values[e]
                var subRuleChecklist: any[] = []
                
                for(var i in subRules){
                    const subRule = subRules[i]
                    const subName = subRule['name'] ? subRule['name'] : "Unnamed" // Ex: Economics
                    const subCondition = subRule['condition'] // Almost all uses TYPE 2. AFRO-Elective uses TYPE 1
                    const values = subRule?.value?.values ? subRule?.value?.values : []; // Ex: [{"logic": "or","value": ["8257721","0099201","0062811","8019831"]}, ...]
                    var subRuleObj = {[subName]: false}
                    var storeCourses: string[] = [] // Used in "completeVariableCoursesAndVariableCredits" and "minimumCredits"
                
                    // console.log("subCondition: ", subCondition)
                    console.log("values array:", values, values.length)

                    switch(subCondition) {
                        case "completedAnyOf": // logic is always "or"
                            for(var e in values){
                                //Ex: coursesObj = {"logic": "or","value": ["8257721","0099201","0062811","8019831"]}
                                const coursesObj = values[e]
                                const logic = coursesObj.logic
                                const value = coursesObj.value
                                // console.log("logic:", logic, "value:", value)
                                for(var v of value){ 
                                    // console.log("v:", v)
                                    if(yourCourses.includes(v)){
                                        validCourses.push(v)

                                        subRuleObj[subName] = true
                                        break; //Only need 1 course
                                    }
                                }
                            }
                            
                        break;
                        
                        case "completedAllOf":  // Logic is either "and" or "or"
                            var countValid = 0

                            for(var e in values){
                                //Ex: coursesObj = {"logic": "or","value": ["8257721","0099201","0062811","8019831"]}
                                const coursesObj = values[e]
                                const logic = coursesObj.logic
                                const value = coursesObj.value

                                if(logic.includes("or")){
                                    for(var v of value){ 
                                        if(yourCourses.includes(v)){ //use 'includes()' instead of 'in' for strings
                                            validCourses.push(v)
                                            countValid++
                                            break; //Only 1 course needs to be in value
                                        }
                                    }
                                }
                                else if(logic.includes("and")){
                                    if(yourCourses.includes(value[0])){ // "and" object will always look like {"logic": "and", "value": ["#######"]}
                                        validCourses.push(value[0])
                                        countValid++
                                        countSat++;
                                    }
                                }
                            }

                            if(countValid == values.length){ 
                                subRuleObj[subName] = true
                            }
                            break;

                        case "minimumCredits":
                            var storeMinCredits = subRule.minCredits
                            for(var e in values){
                                const coursesObj = values[e] //Ex: coursesObj = {"logic": "or","value": ["8257721","0099201","0062811","8019831"]}
                                const logic = coursesObj.logic
                                const value = coursesObj.value

                                for(var v of value){ 
                                    if(logic.includes("or")){
                                        for(var v of value){ 
                                            if(yourCourses.includes(v)){ //use 'includes()' instead of 'in' for strings
                                                storeCourses.push(v)
                                                break; //Only 1 course needs to be in value
                                            }
                                        }
                                    }
                                    else if(logic.includes("and")){
                                        if(yourCourses.includes(value[0])){
                                            storeCourses.push(v)
                                        }
                                    }
                                }
                            }
                            storeMinCredits -= calculateCredits(storeCourses)
                            if (storeMinCredits <= 0){
                                subRuleObj[subName] = true
                            }
                            break;

                        case "completeVariableCoursesAndVariableCredits":
                            //Checks if credits or courses are used
                            const subMinCredits = subRule.minCredits ? subRule.minCredits : null;
                            const subMaxCredits = subRule.maxCredits ? subRule.maxCredits : null;
                            const subMinCourses = subRule.minCourses ? subRule.minCourses : null;
                            const subMaxCourses = subRule.maxCourses ? subRule.maxCourses : null;

                            for(var e in values){
                                const coursesObj = values[e] //Ex: coursesObj = {"logic": "or","value": ["8257721","0099201","0062811","8019831"]}
                                const logic = coursesObj.logic
                                const value = coursesObj.value

                                for(var v of value){ 
                                    if(logic.includes("or")){
                                        for(var v of value){ 
                                            if(yourCourses.includes(v)){ //use 'includes()' instead of 'in' for strings
                                                storeCourses.push(v)
                                                break; //Only 1 course needs to be in value
                                            }
                                        }
                                    }
                                    else if(logic.includes("and")){
                                        if(yourCourses.includes(value[0])){
                                            storeCourses.push(v)
                                        }
                                    }
                                }
                            }

                            if(calculateCredits(storeCourses) <= maxCredits && calculateCredits(storeCourses) >= minCredits){
                                subRuleObj[subName] = true
                            }
                            else if(storeCourses.length <= maxCourses && storeCourses.length >= minCourses){
                                subRuleObj[subName] = true
                            } 
                            else if (calculateCredits(storeCourses) <= maxCredits && calculateCredits(storeCourses) && storeCourses.length <= maxCourses && storeCourses.length >= minCourses){
                                subRuleObj[subName] = true
                            }
                            
                            break;

                            case "completedAtLeastXOf":
                                
                                break;

                        default: 
                            console.log("Problem In Switch:", subCondition)
                            break;
                    }
                    
                    subRuleChecklist.push(subRuleObj)
                }
                
                checklistObj[coreName] = subRuleChecklist
            }
            else if (condition.includes("anyOf")){
                console.log("anyOf")
            }
            else if (topValues != 0) { // Chracteristics of Rule type 2: empty subRule, uses value
                const topValues = rule.value
                const tValue = topValues.values
                console.log("topValue:", topValues)
                console.log("tValue:", tValue)
                for(var e in tValue){
                    //Ex: values[e] = {"logic": "or","value": ["8257721","0099201","0062811","8019831"]}
                    const logic = tValue[e].logic
                    const value = tValue[e].value

                    switch(condition) {
                        case "completedAnyOf": // Logic is always "or"
                        for(var v of value){
                            if(yourCourses.includes(v)){
                                validCourses.push(v)
                                countSat+= 1;
                                break; //Only 1 course needs to be in value
                            }
                        }
                            break;
                
                        case "completedAllOf":  // Logic is either "and" or "or"
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

                countSat == tValue.length ? checklistObj[coreName] = true : checklistObj[coreName] = false

            }
            else{
                console.log("unknown!")
            }
        }
        const currCredits = calculateCredits(validCourses).toString()
        const curCreditsObj = {"curCreditsInProgram": currCredits}
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
console.log("test calculateCredits:", calculateCredits(['0138241', '0138201']))
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