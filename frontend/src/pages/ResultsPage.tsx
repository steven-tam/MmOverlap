import GopherMajorBarChart from "../components/GopherMajorBarChart";
import CoursesData from "../data/allCourses.json";
import ProgramData from "../data/allMajors.json";
import { useState, useEffect } from "react";

type Course = {
  id: string;
  code: string;
  longName: string;
  credits: { numberOfCredits: number };
};

type customInfoObj = {
  major: any;
  curCreditsInProgram: string;
  validCourses: string;
  programMaxCredits: any;
};

function ResultPage() {
  // const baseUrl = 'http://localhost:3001/api/';
  const [toggle, setToggle] = useState(false);
  const [allPrograms, setAllPrograms] = useState<any>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  let program_selected = sessionStorage.getItem("program_selected");
  let courses_selected = sessionStorage.getItem("courses_selected");
  const yourCourses =
    courses_selected != null ? JSON.parse(courses_selected) : []; //Fixes string or null type error when parsing
  const yourProgram = program_selected != null ? program_selected : "Undecided";

  useEffect(() => {
    //     fetch(baseUrl + "allMajors")
    //   .then(response => {
    //       if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //       }
    //       return response.json();
    //     })
    //     .then(data => {
    //       setAllPrograms(data as Program[])
    //     })

    //     fetch(baseUrl + "allCourses")
    //     .then(response => {
    //         if (!response.ok) {
    //           throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //       })
    //       .then(all_courses => {
    //         setAllCourses(all_courses as Course[])
    //       })
    setAllCourses(CoursesData as Course[]);
    setAllPrograms(ProgramData);
  }, []);

  var creditCounter = 0;

  function handleToggle() {
    setToggle(!toggle);
  }

  function calculateTotalCredits(courseIds: string[], totalCredits: number) {
    totalCredits = 0; // resets counter when you revise your courses
    for (const courseId of courseIds) {
      // Match course ID with the courses data
      for (const course of allCourses) {
        // for of statements invokes the Symbol.iterator. Ignore error for now
        if (course.id.startsWith(courseId.substring(0, 7))) {
          totalCredits += course.credits.numberOfCredits;
          break; // Exit the inner loop after finding the course
        }
      }
    }
    return totalCredits;
  }

  function calculateCredits(courseIds: string[]) {
    var totalCredits = 0;
    for (const courseId of courseIds) {
      // Match course ID with the courses data
      for (const course of allCourses) {
        // for of statements invokes the Symbol.iterator. Ignore error for now
        if (course.id.startsWith(courseId.substring(0, 7))) {
          totalCredits += course.credits.numberOfCredits;
          break; // Exit the inner loop after finding the course
        }
      }
    }
    return totalCredits;
  }

  function createStoreCourses(values: any, yourCourses: string[]) {
    var storeCourses: string[] = [];
    for (var e in values) {
      const coursesObj = values[e]; //Ex: coursesObj = {"logic": "or","value": ["8257721","0099201","0062811","8019831"]}
      const logic = coursesObj.logic;
      const value = coursesObj.value;

      for (var v of value) {
        if (logic.includes("or")) {
          for (var v of value) {
            if (yourCourses.includes(v)) {
              //use 'includes()' instead of 'in' for strings
              storeCourses.push(v);
              break; //Only 1 course needs to be in value
            }
          }
        } else if (logic.includes("and")) {
          if (yourCourses.includes(value[0])) {
            storeCourses.push(v);
          }
        }
      }
    }

    return storeCourses.filter(
      (item, index) => storeCourses.indexOf(item) === index
    ); // Filters out duplicates
  }

  function checkConditions(
    condition: string,
    values: any[],
    storeCourses: string[],
    storeCoursesCredits: number,
    name: string,
    minCredits: number,
    maxCredits: number,
    minCourses: number,
    maxCourses: number
  ) {
    var subRuleObj = { [name]: "False" };

    switch (condition) {
      case "completedAnyOf":
        if (storeCourses.length != 0) {
          subRuleObj[name] = "True";
        }
        break;

      case "completedAllOf": // Logic is either "and" or "or"
        if (storeCourses.length == values.length) {
          subRuleObj[name] = "True";
        }
        break;

      case "minimumCredits":
        var storeMinCredits = minCredits;
        storeMinCredits -= storeCoursesCredits;
        if (storeMinCredits <= 0) {
          subRuleObj[name] = "True";
        }
        break;

      case "completeVariableCoursesAndVariableCredits":
        //Checks if credits or courses are used
        if (
          storeCoursesCredits <= maxCourses &&
          storeCoursesCredits &&
          storeCourses.length <= maxCourses &&
          storeCourses.length >= minCourses
        ) {
          subRuleObj[name] = "True";
        } else if (
          storeCoursesCredits <= maxCredits &&
          storeCoursesCredits >= minCredits
        ) {
          subRuleObj[name] = "True";
        } else if (
          storeCourses.length <= maxCourses &&
          storeCourses.length >= minCourses
        ) {
          subRuleObj[name] = "True";
        }
        break;

      case "completedAtLeastXOf":
        if (storeCourses.length >= minCourses) {
          subRuleObj[name] = "True";
        }
        break;

      case "allOf":
        break;

      case "anyOf":
        break;

      default:
        console.log("Condition Not Found:", condition);
        break;
    }

    return subRuleObj;
  }

  function createChecklist(programObj: any, yourCourses: string[]) {
    const requirements = programObj["requisites"]["requisitesSimple"];
    const checklist: any[] = [];
    var validCourses: string[] = [];

    requirements.forEach((req: any) => {
      const rules = req["rules"];
      const checklistObj: { [key: string]: string } = {};

      checklistObj["requirementTitle"] = req.name; //Adds titles like "Admission Requirements" or "Program Requirements" to checklist

      for (var i in rules) {
        // Chracteristics of Rule TYPE 1: uses subRule, no values, conditions: ["allOf", "anyOf"]
        // Chracteristics of Rule TYPE 2: empty subRule, uses value, conditions: ["completedAllOf", "completedAnyOf", "completeVariableCoursesAndVariableCredits", "minimumCredits", "completedAtLeastXOf"]
        const rule = rules[i];
        const condition: string = rule.condition; // Can be Rule TYPE 1 or TYPE 2
        const coreName = rule.name; //Ex: Major: Astrophysics,  "Mathematics Core", "Statics Core", ect
        const subRules = rule.subRules; // Used for type 1
        const ruleValue = rule.value ? rule.value : []; // Used for TYPE 2

        // Used in "completeVariableCoursesAndVariableCredits" and "completedAtLeastXOf"
        const minCredits = rule.minCredits ? rule.minCredits : null;
        const maxCredits = rule.maxCredits ? rule.maxCredits : null;
        const minCourses = rule.minCourses ? rule.minCourses : null;
        const maxCourses = rule.maxCourses ? rule.maxCourses : null;

        if (condition.includes("allOf")) {
          // Condition for handling type 1
          let subRuleChecklist: any[] = [];

          for (var i in subRules) {
            const subRule = subRules[i];
            const subName: string = subRule["name"]
              ? subRule["name"]
              : "Unnamed"; // Ex: Economics
            const subCondition = subRule["condition"]; // Almost all uses TYPE 2. AFRO-Elective uses TYPE 1
            const values: any[] = subRule?.value?.values
              ? subRule?.value?.values
              : []; // Ex: [{"logic": "or","value": ["8257721","0099201","0062811","8019831"]}, ...]
            const storeCourses: string[] = createStoreCourses(
              values,
              yourCourses
            );
            const storeCoursesCredits: number = calculateCredits(storeCourses);

            const subMinCredits = subRule.minCredits
              ? subRule.minCredits
              : null;
            const subMaxCredits = subRule.maxCredits
              ? subRule.maxCredits
              : null;
            const subMinCourses = subRule.minCourses
              ? subRule.minCourses
              : null;
            const subMaxCourses = subRule.maxCourses
              ? subRule.maxCourses
              : null;

            const subRuleObj = checkConditions(
              subCondition,
              values,
              storeCourses,
              storeCoursesCredits,
              subName,
              subMinCredits,
              subMaxCredits,
              subMinCourses,
              subMaxCourses
            );

            validCourses.push(...storeCourses); // for tracking courses in program

            subRuleChecklist.push(subRuleObj);
          }

          const subRuleObjValues = subRuleChecklist.flatMap((obj) =>
            Object.values(obj)
          );
          if (!subRuleObjValues.includes("False")) {
            checklistObj[coreName + "?"] = JSON.stringify([
              "True",
              subRuleChecklist,
            ]);
          } else {
            checklistObj[coreName + "?"] = JSON.stringify([
              "False",
              subRuleChecklist,
            ]);
          }
        } else if (condition.includes("anyOf")) {
          var subRuleChecklist: any[] = [];

          for (var i in subRules) {
            const subRule = subRules[i];
            const subName: string = subRule["name"]
              ? subRule["name"]
              : "Unnamed"; // Ex: Economics
            const subCondition = subRule["condition"]; // Almost all uses TYPE 2. AFRO-Elective uses TYPE 1
            const values: any[] = subRule?.value?.values
              ? subRule?.value?.values
              : []; // Ex: [{"logic": "or","value": ["8257721","0099201","0062811","8019831"]}, ...]
            const storeCourses: string[] = createStoreCourses(
              values,
              yourCourses
            );
            const storeCoursesCredits: number = calculateCredits(storeCourses);

            const subMinCredits = subRule.minCredits
              ? subRule.minCredits
              : null;
            const subMaxCredits = subRule.maxCredits
              ? subRule.maxCredits
              : null;
            const subMinCourses = subRule.minCourses
              ? subRule.minCourses
              : null;
            const subMaxCourses = subRule.maxCourses
              ? subRule.maxCourses
              : null;

            const subRuleObj = checkConditions(
              subCondition,
              values,
              storeCourses,
              storeCoursesCredits,
              subName,
              subMinCredits,
              subMaxCredits,
              subMinCourses,
              subMaxCourses
            );

            validCourses.push(...storeCourses); // for tracking courses in program
            subRuleChecklist.push(subRuleObj);
          }

          const subRuleObjValues = subRuleChecklist.flatMap((obj) =>
            Object.values(obj)
          ); // Array of boolean values. ex: [true, true, false]
          if (subRuleObjValues.includes("True")) {
            checklistObj[coreName + "?"] = JSON.stringify([
              "True",
              subRuleChecklist,
            ]);
          } else {
            checklistObj[coreName + "?"] = JSON.stringify([
              "False",
              subRuleChecklist,
            ]);
          }
        } else if (ruleValue != 0) {
          // Chracteristics of Rule type 2: empty subRule, uses value
          const ruleValues = ruleValue.values;
          const storeCourses = createStoreCourses(ruleValues, yourCourses);
          const storeCoursesCredits = calculateCredits(storeCourses);

          validCourses.push(...storeCourses); // for tracking courses in program

          switch (condition) {
            case "completedAnyOf":
              if (storeCourses.length != 0) {
                checklistObj[coreName] = "True";
              }
              break;

            case "completedAllOf": // Logic is either "and" or "or"
              if (storeCourses.length == ruleValues.length) {
                checklistObj[coreName] = "True";
              }

              break;

            case "minimumCredits":
              var storeMinCredits = rule.minCredits;
              storeMinCredits -= storeCoursesCredits;
              if (storeMinCredits <= 0) {
                checklistObj[coreName] = "True";
              }
              break;

            case "completeVariableCoursesAndVariableCredits":
              //Checks if credits or courses are used
              if (
                storeCoursesCredits <= maxCredits &&
                storeCoursesCredits &&
                storeCourses.length <= maxCourses &&
                storeCourses.length >= minCourses
              ) {
                checklistObj[coreName] = "True";
              } else if (
                storeCoursesCredits <= maxCredits &&
                storeCoursesCredits >= minCredits
              ) {
                checklistObj[coreName] = "True";
              } else if (
                storeCourses.length <= maxCourses &&
                storeCourses.length >= minCourses
              ) {
                checklistObj[coreName] = "True";
              }
              break;

            case "completedAtLeastXOf":
              if (storeCourses.length >= minCourses) {
                checklistObj[coreName] = "True";
              }
              break;

            default:
              break;
          }
        } else {
          console.log("Condition Unsupported:", condition);
        }
      }
      checklist.push(checklistObj);
    });
    // Customize information here
    const uniqueValidCourses = validCourses.filter(
      (item, index) => validCourses.indexOf(item) == index
    ); // Removes Duplicates
    const currCredits = calculateCredits(uniqueValidCourses).toString(); // Parsing to string for consistency

    const customInfoObj = {
      major: programObj.catalogDisplayName,
      curCreditsInProgram: currCredits,
      validCourses: JSON.stringify(uniqueValidCourses),
      programMaxCredits: programObj.customFields.cdProgramCreditsProgramMax,
    } as customInfoObj; //fixes value is type unknown error in line 416
    checklist.push(customInfoObj);

    return checklist;
  }

  function checkRequirements(yourProgram: string) {
    const getProgramObj =
      yourProgram != "Undecided"
        ? allPrograms.find((p: any) => p.catalogDisplayName == yourProgram)
        : false;

    if (getProgramObj) {
      return createChecklist(getProgramObj, yourCourses);
    } else {
      return [
        {
          major: "Undecided",
          curCreditsInProgram: "0",
          programMaxCredits: null,
          validCourses: "[]",
        },
      ];
    }
  }

  
  const yourMajorChecklist = checkRequirements(yourProgram);
  const lastObjChecklist = yourMajorChecklist[yourMajorChecklist.length - 1];
  const maxCreditsProgram = lastObjChecklist.programMaxCredits
    ? lastObjChecklist.programMaxCredits
    : "N/A";

  return (
    <div>
      <div>
        <p className="text-lg font-bold">
          Total Credits: {calculateTotalCredits(yourCourses, creditCounter)}
        </p>
        <p className="text-lg font-bold">
          Credits In Your Program: {lastObjChecklist.curCreditsInProgram}
        </p>
        <p className="text-lg font-bold">
          Max Credits In Your Program: {maxCreditsProgram}
        </p>
      </div>
      <p className="text-lg font-bold">Show: </p>
      <button
        onClick={handleToggle}
        className={`toggle-button ${
          toggle ? "on" : "off"
        } bg-gray-100 border-2 border-github-black shadow-md my-2`}
      >
        {toggle ? "All Courses" : "Courses in Your Major"}
      </button>

      <GopherMajorBarChart
        myCourseIDs={yourCourses}
        myMajor={yourProgram}
        onlyMajorCourses={toggle}
      />
    </div>
  );
}

export default ResultPage;
