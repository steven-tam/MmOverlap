import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import all_courses from "../../../jsonGenerator/allCourses.json";
import course_names from "../../../jsonGenerator/courseNames.json";
import { Navigate, useNavigate, redirect } from "react-router-dom";
import CourseLists from "./CourseLists";


type Course = {
  ind: number; // Index in search bar, see handleCourseClick / handleKeyDown
  code: string; // Course code
};

export default function AutoCompleteSearchBar() {
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
    <div className="flex flex-col max-w-lg mx-auto mt-20">
      <div>

      <div className="bg-white max-h-96 overflow-y-scroll">
        {selections.map((selection) => (
          <div>
            <p className="py-2 px-4 flex items-center justify-between gap-8 hover:bg-gray-200 cursor-pointer">
              {selection}
            </p>
            <button onClick={() => removeSelection(selection)}>X</button>
          </div>
        ))}
      </div>

      <input
        type="text"
        className="px-4 py-1 border-gray-500 
            shadow-sm focus:outline-none focus:ring-2 focus:border-blue-500"
        onChange={handleQueryChange}
        onKeyDown={handleKeyDown}
        value={query}
        ref={inputRef}
        placeholder="Search courses"
      />
      {query !== "" && searchResults.length > 0 && (
        <CourseLists
          courses={searchResults}
          selectedCourseIndex={selectedCourseIndex}
          handleCourseClick={handleCourseClick}
        />
      )}
      </div>
        <button className="mt-9"
          // Does nothing right now
        >Next</button>
    </div>
  );
}
