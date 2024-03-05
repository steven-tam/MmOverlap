import { useEffect, useState } from "react";

function CoursePage() {
  let program_selected = sessionStorage.getItem("program_selected");

  return (
    <>
      <h1>Course Page</h1>
      <h1>{program_selected}</h1>
    </>
  );
}

export default CoursePage;
