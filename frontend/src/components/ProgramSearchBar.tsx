import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import ProgramLists from "./ProgramsLists";
import all_progs from "../../../backend/data/allMajors.json";
import prog_names from "../../../backend/data/programNames.json";
import { Navigate, useNavigate, redirect } from "react-router-dom";


type Program = {
  ind: number; // Index in search bar, see handleProgramClick / handleKeyDown
  catalogDisplayName: string;
};

export default function AutoCompleteSearchBar() {
  const [query, setQuery] = useState(""); // Makes space bar appear with user inpu
  const [searchResults, setSearchResults] = useState<Program[]>([]); // Displays / renders search results
  const [selectedProgramIndex, setSelectedProgramIndex] = useState<number>(-1); // Tracks selected index for display / selection

  // Only used to "tell" the search bar what programs there are, setPrograms slightly deceivng
  const [programs, setPrograms] = useState<Program[]>([]);
  useEffect(() => {
    setPrograms(all_progs as Program[]); // Type cast data as a program
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
        (program) =>
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
  function handleProgramClick(program: Program) {
    // Returns to default search after selection
    setQuery(program.catalogDisplayName);
    setSearchResults([]);
  }

  // Redirects user to course selection page once a valid major is entered
  function coursePageRedirect(program_name: string){
    const string_names = (prog_names as string[])

    for(let i = 0; i < string_names.length; i++){
      if(program_name == string_names[i]){
        sessionStorage.setItem("program_selected", program_name)
        nav("/selectCourses")
        location.reload()
      }
    }
  }

  return (
    <div className="flex flex-col max-w-lg mx-auto mt-20">
      <div>
      <input
        type="text"
        className="px-4 py-1 border-gray-500 
            shadow-sm focus:outline-none focus:ring-2 focus:border-blue-500"
        onChange={handleQueryChange}
        onKeyDown={handleKeyDown}
        value={query}
        ref={inputRef}
        placeholder="Search programs"
      />
      {query !== "" && searchResults.length > 0 && (
        <ProgramLists
          programs={searchResults}
          selectedProgramIndex={selectedProgramIndex}
          handleProgramClick={handleProgramClick}
        />
      )}
        <button 
          // When enter clicked, redirect to course page
          onClick={()=> coursePageRedirect(query)}
        >Enter</button>
      </div>
    </div>
  );
}
