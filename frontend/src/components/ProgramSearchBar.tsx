import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import ProgramLists from "./ProgramsLists";
import {useNavigate} from "react-router-dom";
import all_progs from "../data/allMajors.json";
import prog_names from "../data/programNames.json";



export default function AutoCompleteSearchBar() {
  // const baseUrl = 'http://localhost:3001/api/'
  const [query, setQuery] = useState(""); // Makes space bar appear with user inpu
  const [searchResults, setSearchResults] = useState<any>([]); // Displays / renders search results
  const [selectedProgramIndex, setSelectedProgramIndex] = useState<number>(-1); // Tracks selected index for display / selection
  const [programDescription, setProgramDescription] = useState<string>(''); // // Stores cdProgramDescr for chosen program
  // Only used to "tell" the search bar what programs there are, setPrograms slightly deceivng
  const [programs, setPrograms] = useState<any>([]);
  const [progNames, setProgNames] = useState<string[]>([])

  useEffect(() => {
    // // Request allMajors from Server
    // fetch(baseUrl + "allMajors")
    // .then(response => {
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    //   })
    //   .then(data => {
    //     setPrograms(data as Program[])
    //   })

    //   // Request programNames from Server
    //   fetch(baseUrl + "programNames")
    // .then(response => {
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    //   })
    //   .then(data => {
    //     setProg_names(data as string[])
    //   })

    setPrograms(all_progs); // Type cast data as a program
    setProgNames(prog_names as string[]);
  }, []);
  
  // Used to take user data from search bar input
  const inputRef = useRef<HTMLInputElement>(null);

  // Used to navigate to different pages conditionally
  const nav = useNavigate();

  // Handles search bar input / changes
  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setSearchResults(
      programs.filter(
        (program:any) => 
          program.catalogDisplayName
            .toLowerCase()
            .includes(event.target.value.toLowerCase()) // Filters search results accordingly
      )
    );
  }

  // Allows the user to scroll list with keys / use enter to select
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") {
      setSelectedProgramIndex((prevIndex) =>
        // If prevIndex is -1, set selected program index to last element, else go down
        prevIndex === -1 ? searchResults.length - 1 : prevIndex - 1
      );
    } else if (event.key === "ArrowDown") {
      setSelectedProgramIndex((prevIndex) =>
        // If prevIndex is -1, set selected program index to last element, else go down
        prevIndex === searchResults.length - 1 ? -1 : prevIndex + 1
      );
    } else if (event.key === "Enter") {
      if (selectedProgramIndex !== -1) {
        // Uses index attribute to locate the program selected
        // No functionality with backend as of now, does not send anything
        const selectedProgram = searchResults[selectedProgramIndex];

        // Returns to default search after selection
        setQuery(selectedProgram.catalogDisplayName);
        setSelectedProgramIndex(-1);
        setSearchResults([]);
      }
    }
  }

  // Allows the user to click element to select
  function handleProgramClick(program: any) {
    // Returns to default search after selection
    setQuery(program.catalogDisplayName);
    setProgramDescription(program.customFields.cdProgramDescr)
    setSearchResults([]);
  }

  // Redirects user to course selection page once a valid major is entered
  function coursePageRedirect(program_name: string){
    const string_names = progNames ? progNames : []
    if (string_names.includes(program_name)){
      sessionStorage.setItem("program_selected", program_name)
        nav("/selectCourses")
        location.reload()
    }
    
  }

  return (
    <div className="flex flex-col justify-center mt-6 mb-6 gap-4">
      <div className="max-w-lg mx-auto md:w-[96rem] mt-20 mb-28">
        <div className="flex relative">
          
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 z-10" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            
            <input
              type="text"
              id="search_bar"
              className="w-full py-2 ps-10 border-gray-500 h-10 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-light-gold rounded peer"
              onChange={handleQueryChange}
              onKeyDown={handleKeyDown}
              value={query}
              ref={inputRef}
              placeholder="Search Majors"
            />
            <label htmlFor="search_bar" className="absolute text-lg bottom-10 z-1 origin-[0] px-2 font-bold">Enter Your Major</label>

          <button
            // When enter clicked, redirect to course page
            onClick={() => coursePageRedirect(query)}
            className="h-10 bg-gray-100 rounded-md ml-2 shadow-md relative"
          >Enter
          </button>
        </div>

        {query !== "" && searchResults.length > 0 && (
          <ProgramLists
            programs={searchResults}
            selectedProgramIndex={selectedProgramIndex}
            handleProgramClick={handleProgramClick}
          />
        )}
      </div>

      <div>
        <p className="text-4xl font-bold mb-1 p-3 rounded underline">Program Description</p> 
        <p className="h-[300px] md:w-full overflow-auto p-3 text-lg rounded-lg border-2 border-github-black shadow">{programDescription}</p>
      </div>

    </div>
  );
}
