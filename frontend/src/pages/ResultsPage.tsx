import ChartResults from '../components/ChartResults';
import CoursesData from "../../../backend/data/allCourses.json";
import ProgramData from "../../../backend/data/allMajors.json";
import {useState} from 'react';

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
    const [toggle, setToggle] = useState(false);
  let program_selected = sessionStorage.getItem("program_selected");
  let courses_selected = sessionStorage.getItem("courses_selected");
  const yourCourses = courses_selected != null ? JSON.parse(courses_selected) : [] //Fixes string or null type error when parsing
  const yourProgram = program_selected != null ? program_selected : "Undecided"
  const allPrograms = ProgramData as Program[] //type casts programData
  const allCourses = CoursesData as Course[] //type casts coursesData
  var creditCounter = 0;

  function handleToggle(){
    setToggle(!toggle)
  }

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

function createStoreCourses(values: any, yourCourses: string[]){
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

    return storeCourses.filter((item, index)=> storeCourses.indexOf(item) === index) // Filters out duplicates
}


function checkConditions(condition:string, values:any[], storeCourses: string[], storeCoursesCredits:number, name:string, minCredits:number, maxCredits:number, minCourses:number, maxCourses:number){
    var subRuleObj = {[name]: 'False'}

    switch(condition) {
        case "completedAnyOf": 
            if (storeCourses.length != 0){
                subRuleObj[name] = 'True'
            }
        break;
        
        case "completedAllOf":  // Logic is either "and" or "or"
            if(storeCourses.length == values.length){ 
                subRuleObj[name] = 'True'
            }
            break;

        case "minimumCredits":
            var storeMinCredits = minCredits
            storeMinCredits -= storeCoursesCredits
            if (storeMinCredits <= 0){
                subRuleObj[name] = 'True'
            }
            break;

        case "completeVariableCoursesAndVariableCredits":
            //Checks if credits or courses are used
            if (storeCoursesCredits <= maxCourses && storeCoursesCredits && storeCourses.length <= maxCourses && storeCourses.length >= minCourses){
                subRuleObj[name] = 'True'
            }
            else if(storeCoursesCredits <= maxCredits && storeCoursesCredits >= minCredits){
                subRuleObj[name] = 'True'
            }
            else if(storeCourses.length <= maxCourses && storeCourses.length >= minCourses){
                subRuleObj[name] = 'True'
            } 
            break;

            case "completedAtLeastXOf":
                if(storeCourses.length >= minCourses){
                    subRuleObj[name] = 'True'
                }
                break;

            case "allOf":
                break;

            case "anyOf":
                break;

        default: 
            console.log("Condition Not Found:", condition)
            break;
    }

    return subRuleObj
}

function createChecklist(programObj: any, yourCourses: string[]){
    const requirements = programObj['requisites']['requisitesSimple']
    const checklist: any[] = [];
    var validCourses: string[] = []
    
    requirements.forEach((req:any) =>{
        const rules = req['rules']
        const checklistObj: { [key: string]: string } = {};

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
                    const storeCourses: string[] = createStoreCourses(values, yourCourses)
                    const storeCoursesCredits: number = calculateCredits(storeCourses)

                    const subMinCredits = subRule.minCredits ? subRule.minCredits : null;
                    const subMaxCredits = subRule.maxCredits ? subRule.maxCredits : null;
                    const subMinCourses = subRule.minCourses ? subRule.minCourses : null;
                    const subMaxCourses = subRule.maxCourses ? subRule.maxCourses : null;

                    const subRuleObj = checkConditions(subCondition, values, storeCourses, storeCoursesCredits, subName, subMinCredits, subMaxCredits, subMinCourses, subMaxCourses)

                    validCourses.push(...storeCourses) // for tracking courses in program

                    subRuleChecklist.push(subRuleObj)
                }

                const subRuleObjValues = subRuleChecklist.flatMap(obj => Object.values(obj))
                if(!subRuleObjValues.includes('False')){
                    checklistObj[coreName + "?"] = JSON.stringify(['True', subRuleChecklist])
                }
                else{
                    checklistObj[coreName + "?"] = JSON.stringify(['False', subRuleChecklist])
                }
        
            }
            else if (condition.includes("anyOf")){
                var subRuleChecklist: any[] = []
                
                for(var i in subRules){
                    const subRule = subRules[i]
                    const subName:string = subRule['name'] ? subRule['name'] : "Unnamed" // Ex: Economics
                    const subCondition = subRule['condition'] // Almost all uses TYPE 2. AFRO-Elective uses TYPE 1
                    const values: any[] = subRule?.value?.values ? subRule?.value?.values : []; // Ex: [{"logic": "or","value": ["8257721","0099201","0062811","8019831"]}, ...]
                    const storeCourses: string[] = createStoreCourses(values, yourCourses)
                    const storeCoursesCredits: number = calculateCredits(storeCourses)

                    const subMinCredits = subRule.minCredits ? subRule.minCredits : null;
                    const subMaxCredits = subRule.maxCredits ? subRule.maxCredits : null;
                    const subMinCourses = subRule.minCourses ? subRule.minCourses : null;
                    const subMaxCourses = subRule.maxCourses ? subRule.maxCourses : null;
                    
                    const subRuleObj = checkConditions(subCondition, values, storeCourses, storeCoursesCredits, subName, subMinCredits, subMaxCredits, subMinCourses, subMaxCourses)

                    validCourses.push(...storeCourses) // for tracking courses in program
                    subRuleChecklist.push(subRuleObj)
                }
                
                const subRuleObjValues = subRuleChecklist.flatMap(obj => Object.values(obj)) // Array of boolean values. ex: [true, true, false]
                if(subRuleObjValues.includes('True')){
                    checklistObj[coreName + "?"] = JSON.stringify(['True', subRuleChecklist])
                
                }
                else{
                    checklistObj[coreName + "?"] = JSON.stringify(['False', subRuleChecklist])
                }

            }
            else if (ruleValue != 0) { // Chracteristics of Rule type 2: empty subRule, uses value
                const ruleValues = ruleValue.values
                const storeCourses = createStoreCourses(ruleValues, yourCourses)
                const storeCoursesCredits = calculateCredits(storeCourses)
                
                validCourses.push(...storeCourses) // for tracking courses in program
              

                switch(condition) {
                    case "completedAnyOf": 
                        if (storeCourses.length != 0){
                            checklistObj[coreName] = 'True'
                        }
                    break;
                    
                    case "completedAllOf":  // Logic is either "and" or "or"
                        if(storeCourses.length == ruleValues.length){ 
                            checklistObj[coreName] = 'True'
                        }
                        
                        break;

                    case "minimumCredits":
                        var storeMinCredits = rule.minCredits
                        storeMinCredits -= storeCoursesCredits
                        if (storeMinCredits <= 0){
                            checklistObj[coreName] = 'True'
                        }
                        break;

                    case "completeVariableCoursesAndVariableCredits":
                        //Checks if credits or courses are used
                        if (storeCoursesCredits <= maxCredits && storeCoursesCredits && storeCourses.length <= maxCourses && storeCourses.length >= minCourses){
                            checklistObj[coreName] = 'True'
                        }
                        else if(storeCoursesCredits <= maxCredits && storeCoursesCredits >= minCredits){
                            checklistObj[coreName] = 'True'
                        }
                        else if(storeCourses.length <= maxCourses && storeCourses.length >= minCourses){
                            checklistObj[coreName] = 'True'
                        } 
                        break;

                        case "completedAtLeastXOf":
                            if(storeCourses.length >= minCourses){
                                checklistObj[coreName] = 'True'
                            }
                            break;

                    default: 
                        console.log("Condition Not Found:", condition)
                        break;
                }

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
    
    const customInfoObj = {"major": programObj.catalogDisplayName ,"curCreditsInProgram": currCredits, "validCourses": JSON.stringify(uniqueValidCourses), "programMaxCredits": programObj.customFields.cdProgramCreditsProgramMax}
    checklist.push(customInfoObj)

    return checklist
}

function checkRequirements(yourProgram: string){
    const getProgramObj = yourProgram != 'Undecided' ? allPrograms.find(p => p.catalogDisplayName == yourProgram): false 
  
    if (getProgramObj){
        return createChecklist(getProgramObj, yourCourses)
    }
    else{
        return [{"major": "Undecided", "curCreditsInProgram": "0", "programMaxCredits": null, "validCourses": "[]"}]
    }
}

function createSortedOverlap(lastObjChecklist:any){
    //lastObj Ex: {"major": "Undecided", "curCreditsInProgram": "0", "programMaxCredits": null, "validCourses": "[]"}
    if(lastObjChecklist.major == 'Undecided'){
        return []
    }
    else{

        const allLastObjs = allPrograms.map(prog => {
            if (toggle){
                const validCourses = JSON.parse(lastObjChecklist.validCourses) ? JSON.parse(lastObjChecklist.validCourses): []
                const checkList = createChecklist(prog, validCourses)
                return checkList[checkList.length-1] //lastObj
            }
            else{
                const checkList = createChecklist(prog, yourCourses)
                return checkList[checkList.length-1] //lastObj
            }
        })

        const relevantLastObjs = allLastObjs.filter(lastObj => {return lastObj.curCreditsInProgram > 0}) // Filters out programs with no overlap 
        const sortByOverlap = relevantLastObjs.sort((a , b) => {return b.curCreditsInProgram - a.curCreditsInProgram}) // Sort by ascending to decending
    
        return sortByOverlap
    }
}


const yourMajorChecklist = checkRequirements(yourProgram)
const lastObjChecklist = yourMajorChecklist[yourMajorChecklist.length-1]
const maxCreditsProgram = lastObjChecklist.programMaxCredits ? lastObjChecklist.programMaxCredits : "N/A"
const sortedByOverlap = createSortedOverlap(lastObjChecklist)

return (
  <div> 
    <div className="">
        <p className='text-lg font-bold'>Total Credits: {calculateTotalCredits(yourCourses, creditCounter)} </p>
        <p className='text-lg font-bold'>Credits In Your Program: {lastObjChecklist.curCreditsInProgram}</p>
        <p className='text-lg font-bold'>Max Credits In Your Program: {maxCreditsProgram}</p>
    </div>
     
    <button onClick={handleToggle} className={`toggle-button ${toggle ? 'on' : 'off'}`}>
    {toggle ? 'Show All Courses' : 'Show Major Courses'}
    </button>
   
    
    <ChartResults 
      selectedProgram={yourProgram} 
      sortedByOverlap={sortedByOverlap}
    />
    <div>
        {yourMajorChecklist.map((element, index) => (
            <div key={index}>
                <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{element.requirementTitle}</h2>
                <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
                    {Object.entries(element).map(([key, value], idx:number) => {
                        if( key !== 'requirementTitle' && key !== 'validCourses' && key !== 'curCreditsInProgram' && key !== 'programMaxCredits' && !key.includes("?") && key != 'major'){
                            if(value.includes("True")){
                                return (
                                    <li key={idx} className="flex items-center">
                                        <svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                        </svg>
                                        {key}
                                    </li>
                                )
                            }
                            else{
                                return (
                                    <li key={idx} className="flex items-center">
                                        <svg className="w-3.5 h-3.5 me-2 text-gray-500 dark:text-gray-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                        </svg>
                                        {key}
                                    </li>
                                )
                            }
                        } 
                        else if (key.includes("?")){
                            const k = key.substring(0, key.length-1) // Removes "?"
                            const parseSubRules = JSON.parse(value) 
                            var j = []
                            for(const i in parseSubRules[1]){
                                const obj = parseSubRules[1][i] 
                                const subKey = Object.keys(obj)[0]  
                                
                                if(obj[subKey].includes("True")){
                                    j.push(
                                        <li key={idx} className="flex items-center">
                                            <svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                            </svg>
                                            {subKey}
                                        </li>
                                    )
                                }
                                else{
                                    j.push(
                                        <li key={idx} className="flex items-center">
                                            <svg className="w-3.5 h-3.5 me-2 text-gray-500 dark:text-gray-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                            </svg>
                                            {subKey}
                                        </li>
                                    )
                                }

                            }
                            if(parseSubRules[0].includes("True")){
                                return (
                                    <div>
                                        <li key={idx} className="flex items-center">
                                            <svg className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                            </svg>
                                            {k}
                                        </li>
                                        <ul className="ps-8 mt-2 space-y-1 list-disc list-inside">
                                            {j.map(subRule => subRule)}
                                        </ul>
                                    </div>
                                )
                            }else{
                                return (
                                    <div>
                                        <li key={idx} className="flex items-center">
                                            <svg className="w-3.5 h-3.5 me-2 text-gray-500 dark:text-gray-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                                            </svg>
                                            {k}
                                        </li>
                                        <ul className="ps-8 mt-2 space-y-1 list-disc list-inside">
                                            {j.map(subRule => subRule)}
                                        </ul>
                                    </div>
                                )
                            }
                        }
                    })}
            </ul>
            </div>
        ))}
      </div>
  </div>
)
}


export default ResultPage