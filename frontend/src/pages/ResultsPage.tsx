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

function getCoursesInRule(values: any, yourCourses: string[]){
    var storeCourses: string[] = []
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

    return storeCourses.filter((item, index)=> storeCourses.indexOf(item) === index) // storeCourses without duplicates
}

function createChecklist(programObj: any, yourCourses: string[]){
    const requirements = programObj['requisites']['requisitesSimple']
    const checklist: any[] = [];
    var validCourses: string[] = []
    
    requirements.forEach((req:any) =>{
        const rules = req['rules']
        const checklistObj: { [key: string]: any } = {};

        checklistObj['requirementTitle'] = req.name;  //Adds titles like "Admission Requirements" or "Program Requirements" to checklist
        
        for(var i in rules){
            // Chracteristics of Rule TYPE 1: uses subRule, no values, conditions: ["allOf", "anyOf"]
            // Chracteristics of Rule TYPE 2: empty subRule, uses value, conditions: ["completedAllOf", "completedAnyOf", "completeVariableCoursesAndVariableCredits", "minimumCredits", "completedAtLeastXOf"]
            const rule = rules[i]
            const condition: string = rule.condition // Can be Rule TYPE 1 or TYPE 2
            const coreName = rule.name //Ex: Major: Astrophysics,  "Mathematics Core", "Statics Core", ect
            const subRules = rule.subRules // Used for type 1
            const ruleValue = rule.value ? rule.value : [] // Used for TYPE 2

            // Used in "completeVariableCoursesAndVariableCredits" and "completedAtLeastXOf"
            var minCredits = rule.minCredits ? rule.minCredits : null;
            var maxCredits = rule.maxCredits ? rule.maxCredits : null;
            var minCourses = rule.minCourses ? rule.minCourses : null;
            var maxCourses = rule.maxCourses ? rule.maxCourses : null;
            

            if(condition.includes("allOf")){ // Condition for handling type 1
                var subRuleChecklist: any[] = []
                
                for(var i in subRules){
                    const subRule = subRules[i]
                    const subName:string = subRule['name'] ? subRule['name'] : "Unnamed" // Ex: Economics
                    const subCondition = subRule['condition'] // Almost all uses TYPE 2. AFRO-Elective uses TYPE 1
                    const values: any[] = subRule?.value?.values ? subRule?.value?.values : []; // Ex: [{"logic": "or","value": ["8257721","0099201","0062811","8019831"]}, ...]
                    const storeCourses: string[] = getCoursesInRule(values, yourCourses)
                    const storeCoursesCredits: number = calculateCredits(storeCourses)
                    var subRuleObj = {[subName]: false}
                    validCourses.push(...storeCourses) // for tracking courses in program
                  

                    const subMinCredits = subRule.minCredits ? subRule.minCredits : null;
                    const subMaxCredits = subRule.maxCredits ? subRule.maxCredits : null;
                    const subMinCourses = subRule.minCourses ? subRule.minCourses : null;
                    const subMaxCourses = subRule.maxCourses ? subRule.maxCourses : null;
                    
                    switch(subCondition) {
                        case "completedAnyOf": 
                            if (storeCourses.length != 0){
                                subRuleObj[subName] = true
                            }
                        break;
                        
                        case "completedAllOf":  // Logic is either "and" or "or"
                            if(storeCourses.length == values.length){ 
                                subRuleObj[subName] = true
                            }
                            break;

                        case "minimumCredits":
                            var storeMinCredits = subRule.minCredits
                            storeMinCredits -= storeCoursesCredits
                            if (storeMinCredits <= 0){
                                subRuleObj[subName] = true
                            }
                            break;

                        case "completeVariableCoursesAndVariableCredits":
                            //Checks if credits or courses are used
                            if (storeCoursesCredits <= subMaxCourses && storeCoursesCredits && storeCourses.length <= subMaxCourses && storeCourses.length >= subMinCourses){
                                subRuleObj[subName] = true
                            }
                            else if(storeCoursesCredits <= subMaxCredits && storeCoursesCredits >= subMinCredits){
                                subRuleObj[subName] = true
                            }
                            else if(storeCourses.length <= subMaxCourses && storeCourses.length >= subMinCourses){
                                subRuleObj[subName] = true
                            } 
                            break;

                            case "completedAtLeastXOf":
                                if(storeCourses.length >= subMinCourses){
                                    subRuleObj[subName] = true
                                }
                                break;

                        default: 
                            console.log("Condition Not Found:", subCondition)
                            break;
                    }
                    
                    subRuleChecklist.push(subRuleObj)
                }

                const subRuleObjValues = subRuleChecklist.flatMap(obj => Object.values(obj))
                if(!subRuleObjValues.includes(false)){
                    checklistObj[coreName] = true
                    checklistObj["subRules?"+coreName] = subRuleChecklist
                }
                else{
                    checklistObj[coreName] = false
                    checklistObj["subRules?"+coreName] = subRuleChecklist
                }
        
            }
            else if (condition.includes("anyOf")){
                var subRuleChecklist: any[] = []
                
                for(var i in subRules){
                    const subRule = subRules[i]
                    const subName:string = subRule['name'] ? subRule['name'] : "Unnamed" // Ex: Economics
                    const subCondition = subRule['condition'] // Almost all uses TYPE 2. AFRO-Elective uses TYPE 1
                    const values: any[] = subRule?.value?.values ? subRule?.value?.values : []; // Ex: [{"logic": "or","value": ["8257721","0099201","0062811","8019831"]}, ...]
                    const storeCourses: string[] = getCoursesInRule(values, yourCourses)
                    const storeCoursesCredits: number = calculateCredits(storeCourses)
                    validCourses.push(...storeCourses) // for tracking courses in program
                    var subRuleObj = {[subName]: false}
                   

                    const subMinCredits = subRule.minCredits ? subRule.minCredits : null;
                    const subMaxCredits = subRule.maxCredits ? subRule.maxCredits : null;
                    const subMinCourses = subRule.minCourses ? subRule.minCourses : null;
                    const subMaxCourses = subRule.maxCourses ? subRule.maxCourses : null;
                    
                    switch(subCondition) {
                        case "completedAnyOf": 
                            if (storeCourses.length != 0){
                                subRuleObj[subName] = true
                            }
                        break;
                        
                        case "completedAllOf":  // Logic is either "and" or "or"
                            if(storeCourses.length == values.length){ 
                                subRuleObj[subName] = true
                            }
                            break;

                        case "minimumCredits":
                            var storeMinCredits = subRule.minCredits
                            storeMinCredits -= storeCoursesCredits
                            if (storeMinCredits <= 0){
                                subRuleObj[subName] = true
                            }
                            break;

                        case "completeVariableCoursesAndVariableCredits":
                            //Checks if credits or courses are used
                            if (storeCoursesCredits <= subMaxCourses && storeCoursesCredits && storeCourses.length <= subMaxCourses && storeCourses.length >= subMinCourses){
                                subRuleObj[subName] = true
                            }
                            else if(storeCoursesCredits <= subMaxCredits && storeCoursesCredits >= subMinCredits){
                                subRuleObj[subName] = true
                            }
                            else if(storeCourses.length <= subMaxCourses && storeCourses.length >= subMinCourses){
                                subRuleObj[subName] = true
                            } 
                            break;

                            case "completedAtLeastXOf":
                                if(storeCourses.length >= subMinCourses){
                                    subRuleObj[subName] = true
                                }
                                break;

                        default: 
                            console.log("Condition Not Found:", subCondition)
                            break;
                    }
                    
                    subRuleChecklist.push(subRuleObj)
                }
                
                const subRuleObjValues = subRuleChecklist.flatMap(obj => Object.values(obj)) // Array of boolean values. ex: [true, true, false]
                if(subRuleObjValues.includes(true)){
                    checklistObj[coreName] = true
                    checklistObj["subRules?"+coreName] = subRuleChecklist
                }
                else{
                    checklistObj[coreName] = false
                    checklistObj["subRules?"+coreName] = subRuleChecklist
                }

            }
            else if (ruleValue != 0) { // Chracteristics of Rule type 2: empty subRule, uses value
                const ruleValues = ruleValue.values
                const storeCourses = getCoursesInRule(ruleValues, yourCourses)
                validCourses.push(...storeCourses) // for tracking courses in program
                const storeCoursesCredits = calculateCredits(storeCourses)
               
                switch(condition) {
                    case "completedAnyOf": 
                        if (storeCourses.length != 0){
                            checklistObj[coreName] = true
                        }
                    break;
                    
                    case "completedAllOf":  // Logic is either "and" or "or"
                        if(storeCourses.length == ruleValues.length){ 
                            checklistObj[coreName] = true
                        }
                        
                        break;

                    case "minimumCredits":
                        var storeMinCredits = rule.minCredits
                        storeMinCredits -= storeCoursesCredits
                        if (storeMinCredits <= 0){
                            checklistObj[coreName] = true
                        }
                        break;

                    case "completeVariableCoursesAndVariableCredits":
                        //Checks if credits or courses are used
                        if (storeCoursesCredits <= maxCredits && storeCoursesCredits && storeCourses.length <= maxCourses && storeCourses.length >= minCourses){
                            checklistObj[coreName] = true
                        }
                        else if(storeCoursesCredits <= maxCredits && storeCoursesCredits >= minCredits){
                            checklistObj[coreName] = true
                        }
                        else if(storeCourses.length <= maxCourses && storeCourses.length >= minCourses){
                            checklistObj[coreName] = true
                        } 
                        break;

                        case "completedAtLeastXOf":
                            if(storeCourses.length >= minCourses){
                                checklistObj[coreName] = true
                            }
                            break;

                    default: 
                        console.log("Condition Not Found:", condition)
                        break;
                }
                console.log("checklistObj:", checklistObj)

            }
            else{
                console.log("Error!")
            }
        }
        checklist.push(checklistObj)

    })
    // Customize information here
    const uniqueValidCourses= validCourses.filter((item,index) => validCourses.indexOf(item) == index) // Removes Duplicates
    const currCredits = calculateCredits(uniqueValidCourses).toString() // Parsing to string for consistency

    const customInfoObj = {"curCreditsInProgram": currCredits, "validCourses": uniqueValidCourses, "programMaxCredits": programObj.customFields.cdProgramCreditsProgramMax}
    checklist.push(customInfoObj)

    console.log('checkList:', checklist)

    return checklist
}

function checkRequirements(yourProgram: string){
    const getProgramObj = yourProgram != 'Undecided' ? allPrograms.find(p => p.catalogDisplayName == yourProgram): false 
    console.log(yourProgram)
    if (getProgramObj){
        const programChecklist = createChecklist(getProgramObj, yourCourses)
     
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