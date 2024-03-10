import { useEffect, useState } from "react";
import CourseSearchBar from "../components/CourseSearchBar";


function CoursePage() {
  let program_selected = sessionStorage.getItem("program_selected");

  return (
    <div>
      <CourseSearchBar selectedProgram={program_selected ? program_selected : "Undecided"}></CourseSearchBar>
    </div>
  );
}

export default CoursePage;
