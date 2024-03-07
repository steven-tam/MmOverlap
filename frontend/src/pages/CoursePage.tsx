import { useEffect, useState } from "react";
import CourseSearchBar from "../components/CourseSearchBar";

function CoursePage() {
  let program_selected = sessionStorage.getItem("program_selected");

  return (
    <>
      <div>
        <h1>Courses completed / in-progress for {program_selected}</h1>
        <br></br>
      </div>
      <CourseSearchBar></CourseSearchBar>
    </>
  );
}

export default CoursePage;
