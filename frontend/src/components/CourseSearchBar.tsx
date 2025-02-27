import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import all_courses from "../data/allCourses.json";
import course_names from "../data/courseNames.json";
import {useNavigate} from "react-router-dom";
import CourseLists from "./CourseLists";


// type Course = {
//   id: string
//   ind: number; // Index in search bar, see handleCourseClick / handleKeyDown
//   code: string; // Course code
// };

type Course = {
  id: string; 
  code: string; 
  longName: string; 
  credits: { numberOfCredits: number; };
};

type prop = {
  selectedProgram: string;
}



export default function AutoCompleteSearchBar({selectedProgram}: prop) {
  // const baseUrl = 'https://gopher-major-planner.onrender.com';
  const [query, setQuery] = useState(""); // Makes space bar appear with user input
  const [searchResults, setSearchResults] = useState<Course[]>([]); // Displays / renders search results
  const [selectedCourseIndex, setSelectedCourseIndex] = useState<number>(-1); // Tracks selected index for display / selection
  const [selections, setSelections] = useState<string[]>([]);   // Tracks courses selected by user
  const [selectionsId, setSelectionsId] = useState<string[]>([]);   // Tracks courses selected by user
  const [courseNames, setCourseNames] = useState<string[]>([])

  // Only used to "tell" the search bar what courses there are, setCourses slightly deceivng
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    // // Request allCourses from Server
    // fetch(baseUrl + "allCourses")
    // .then(response => {
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    //   })
    //   .then(all_courses => {
    //     setCourses(all_courses as Course[])
    //   })

    //   // Request courseNames from Server
    //   fetch(baseUrl + "courseNames")
    // .then(response => {
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    //   })
    //   .then(courseCodes => {
    //     setCourse_names(courseCodes as string[])
    //   })

    setCourses(all_courses as Course[]); // Type cast data as a course
    setCourseNames(course_names);
  }, []);

  // Used to take user data from search bar input
  const inputRef = useRef<HTMLInputElement>(null);

  // Used to navigate to different pages conditionally (Not implemented yet, but see program search bar for example)
  const nav = useNavigate();

  // Handles search bar input / changes
  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setSearchResults(
      courses.filter(
        (course) =>
          course.code
            .toLowerCase()
            .includes(event.target.value.toLowerCase()) // Filters search results accordingly
      )
    );
  }

  // Ensures a user has provided a valid code
  function checkValidCode(code: string){
    let start = 0;
    let end = courseNames.length - 1;
    while(start < end){
      let mid = (start + end)>>1;
      console.log(start,mid,end);
      if(courseNames[mid].localeCompare(code) == 0) return true;
      else if(courseNames[mid].localeCompare(code) < 0) start = mid + 1;
      else end = mid - 1;
    }
    if(courseNames[start].localeCompare(code) == 0) return true;
    alert(`Invalid course!`);
    return false;
  }

  // Checks if a user entered a code already entered
  function checkDuplicate(code: string){
    for(let i = 0; i < selections.length; i++){
        if(code == selections[i]){
            alert(`Course already selected!`);
            return false;
        }
    }
    return true;
  }

  // Allows the user to scroll list with keys / use enter to select
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    var query_1 = query.replace(" ","");
    query_1 = query_1.toUpperCase();
    var query_1 = query.replace(" ","");
    query_1 = query_1.toUpperCase();
    if (event.key === "ArrowUp") {
      setSelectedCourseIndex((prevIndex) =>
        // If prevIndex is -1, set selected course index to last element, else go down
        prevIndex === -1 ? searchResults.length - 1 : prevIndex - 1
      );
    } else if (event.key === "ArrowDown") {
      setSelectedCourseIndex((prevIndex) =>
        // If prevIndex is -1, set selected course index to last element, else go down
        prevIndex === searchResults.length - 1 ? -1 : prevIndex + 1
      );
    } else if (event.key === "Enter") {
      if (selectedCourseIndex !== -1) {
        // Uses index attribute to locate the course selected
        // No functionality with backend as of now, does not send anything

        const selectedCourse = searchResults[selectedCourseIndex];
        if(checkDuplicate(selectedCourse.code)){
            setSelections(selections.concat(selectedCourse.code));  // Updates the selected courses with new selection
            setQuery("");

            // Returns to default search after selection
            setSelectedCourseIndex(-1);
            setSearchResults([]);
        }
      } else if (checkDuplicate(query_1) && checkValidCode(query_1)){   // Case of user typing in full course code and pressing enter
        // NEED TO ACCOUNT FOR USER TYPING CODE IN LOWERCASE, recognize anyway
        setSelections(selections.concat(query_1));
        setQuery("");
      }
    }
  }

  // Allows the user to click element to select
  function handleCourseClick(course: Course) {
    // Returns to default search after selection
    if(checkDuplicate(course.code)){
        setSelections(selections.concat(course.code));
        setSelectionsId(selectionsId.concat(course.id.substring(0,7))); //Adds id of selected courses
        setQuery("");
        setSearchResults([]);
    }
  }

  // Handles the "x" button, allows users to delete courses they inputted
  function removeSelection(ele: string){
    const REMOVE_INDEX = selections.indexOf(ele);

    if(REMOVE_INDEX === 0){
      setSelections(selections.slice(1, selections.length))
      setSelectionsId(selectionsId.slice(1, selectionsId.length));
    } else {
      setSelections(selections.slice(0, REMOVE_INDEX).concat(selections.slice(REMOVE_INDEX + 1, selections.length)))
      setSelectionsId(selectionsId.slice(0, REMOVE_INDEX).concat(selectionsId.slice(REMOVE_INDEX + 1, selectionsId.length)));
    }
  }

  function resultPageRedirect(selectedCourses: string[]){
    sessionStorage.setItem("courses_selected", JSON.stringify([...selectedCourses])) 
    nav("/showResults")
  }

  return (
    <div className="flex flex-col justify-center mt-6 mb-6 gap-4">
      <div className="max-w-lg mx-auto md:w-[96rem] mt-20 mb-28">
        <div className="flex relative">

          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 z-10" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
          </div>

          <input
            type="text"
            id="course_bar"
            className="w-full px-4 py-2 ps-10 border-gray-500 h-10 shadow-md bg-white focus:outline-none focus:ring-2 focus:ring-light-gold rounded"
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            value={query}
            ref={inputRef}
            placeholder="Search Courses"
          />

          <label htmlFor="course_bar" className="absolute text-lg bottom-10 z-1 origin-[0] px-2 font-bold">Add Completed/Ongoing Courses</label>
          <button 
          onClick={() => resultPageRedirect(selectionsId)}
          className="h-10 bg-gray-100 rounded-md ml-2 shadow-md"
          >Next</button>
        </div>

        {query !== "" && searchResults.length > 0 && (
            <CourseLists
              courses={searchResults}
              selectedCourseIndex={selectedCourseIndex}
              handleCourseClick={handleCourseClick}
            />
          )}
      </div>

      <div className="flex flex-col justify-center items-center">
        <p className="w-full text-4xl font-bold mb-1 p-3 rounded underline">{`Your Courses for ${selectedProgram}`}</p> 

        <div className="w-full h-[300px] overflow-auto p-3 text-lg rounded-lg border-2 border-github-black shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {selections.map((selection) => (
              <div key={selection}>
                <button onClick={() => removeSelection(selection)} className="w-full hover:bg-red-300 hover:border-red-300 px-8 shadow-md bg-white border-2">{selection}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
