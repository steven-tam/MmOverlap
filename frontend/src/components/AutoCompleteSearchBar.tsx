import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import ProgramLists from "./ProgramsLists";
import all_progs from "../../../backend-flask/allMajors.json";

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
    setPrograms(all_progs as Program[]); // Type cast dummy data as a program
  }, []);

  // Used to take user data from search bar input
  const inputRef = useRef<HTMLInputElement>(null);

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
        alert(`You selected ${selectedProgram.catalogDisplayName}`);

        // Returns to default search after selection
        setQuery("");
        setSelectedProgramIndex(-1);
        setSearchResults([]);
      }
    }
  }

  // Allows the user to click element to select
  function handleProgramClick(program: Program) {
    // No functionality with backend as of now, does not send anything
    alert(`You selected ${program.catalogDisplayName}`);

    // Returns to default search after selection
    setQuery("");
    setSearchResults([]);
  }

  return (
    <div className="flex flex-col max-w-lg mx-auto mt-20">
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
    </div>
  );
}
