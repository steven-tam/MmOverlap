import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import all_courses from "../../../jsonGenerator/allCourses.json";
import course_names from "../../../jsonGenerator/courseNames.json";
import { Navigate, useNavigate, redirect } from "react-router-dom";
import CourseLists from "./CourseLists";


type Course = {
  ind: number; // Index in search bar, see handleCourseClick / handleKeyDown
  code: string; // Course code
};

type prop = {
  selectedProgram: string;
}



export default function AutoCompleteSearchBar({selectedProgram}: prop) {
  const [query, setQuery] = useState(""); // Makes space bar appear with user input
  const [searchResults, setSearchResults] = useState<Course[]>([]); // Displays / renders search results
  const [selectedCourseIndex, setSelectedCourseIndex] = useState<number>(-1); // Tracks selected index for display / selection
  const [selections, setSelections] = useState<string[]>([]);   // Tracks courses selected by user

  // Only used to "tell" the search bar what courses there are, setCourses slightly deceivng
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    setCourses(all_courses as Course[]); // Type cast data as a course
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
    for(let i = 0; i < course_names.length; i++){
        if(code == course_names[i]){
            return true;
        }
    }
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
      } else if (checkDuplicate(query) && checkValidCode(query)){   // Case of user typing in full course code and pressing enter
        // NEED TO ACCOUNT FOR USER TYPING CODE IN LOWERCASE, recognize anyway
        setSelections(selections.concat(query));
        setQuery("");
      }
    }
  }

  // Allows the user to click element to select
  function handleCourseClick(course: Course) {
    // Returns to default search after selection
    if(checkDuplicate(course.code)){
        setSelections(selections.concat(course.code));
        setQuery("");
        console.log(selections);
        setSearchResults([]);
    }
  }

  // Handles the "x" button, allows users to delete courses they inputted
  function removeSelection(ele: string){
    const REMOVE_INDEX = selections.indexOf(ele);

    if(REMOVE_INDEX === 0){
      setSelections(selections.slice(1, selections.length))
    } else {
      setSelections(selections.slice(0, REMOVE_INDEX).concat(selections.slice(REMOVE_INDEX + 1, selections.length)))
    }
  }

  return (
    <div className="flex flex-col justify-center mt-6 mb-6 gap-4">
      <div className="max-w-lg mx-auto md:w-[96rem] mt-20 mb-28">
        <div className="flex relative">

          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
          </div>

          <input
            type="text"
            className="w-full px-4 py-2 ps-10 border-gray-500 h-10 shadow-md focus:outline-none focus:ring-2 focus:border-blue-500 rounded"
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            value={query}
            ref={inputRef}
            placeholder={`Add Completed/In-Progress Courses for ${selectedProgram}`}
          />
          <button className="h-10 bg-gray-100 rounded-md ml-2 shadow-md"
              // Does nothing right now
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
        <p className="text-gray-400 text-center mb-2">hint: click from your courses to delete a course :)</p>
        <p className="w-full md:w-8/12 text-4xl font-bold mb-1 shadow p-3 rounded">Your Courses:</p> 

        <div className="w-full md:w-8/12 h-[300px] overflow-auto shadow p-3 text-lg rounded">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {selections.map((selection) => (
              <div key={selection}>
                <button onClick={() => removeSelection(selection)} className="w-full hover:bg-red-300 hover:border-red-300 px-8">{selection}</button>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
