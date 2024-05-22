import { useEffect } from "react"

// Class used to form the reccomended list below a user search in the auto-complete search bar

type Course = {
    id: string; 
    code: string; 
    longName: string; 
    credits: { numberOfCredits: number; };
  };

type CourseListProps= {
    selectedCourseIndex: number
    courses: Course[]
    handleCourseClick: (course: Course) => void
}

export default function CourseLists({courses, selectedCourseIndex, handleCourseClick}: CourseListProps) {
    // Function used to always keep the active course in view of user
    function scrollActiveCourseIntoView(index: number){
        const activeCourse = document.getElementById
        (`course-${index}`)
        if(activeCourse){
            activeCourse.scrollIntoView({
            block: "nearest",inline: "start",
            behavior: "smooth"
            })
        }
    }

    // Renders the search bar to reflect function above
    useEffect(() => {
        if(selectedCourseIndex !== -1){
            scrollActiveCourseIntoView(selectedCourseIndex)
        }
    }, [selectedCourseIndex])

    return (
        <div className="bg-white max-h-96 overflow-y-scroll">
            {courses.map((course,index) => (
                <div key={index} className={`${selectedCourseIndex === index ? "bg-gray-200" : ""} py-2 px-4 flex items-center justify-between gap-8 transition-colors duration-150 ease-in-out hover:bg-green-300 rounded cursor-pointer`}
                id={`course-${index}`}
                onClick={() => handleCourseClick(course)}>
                    <p>{course.code}</p>
                </div>
            ))}
        </div>
    )
}