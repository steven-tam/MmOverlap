import { useEffect } from "react"

// Class used to form the reccomended list below a user search in the auto-complete search bar

type Program = {
    ind: number
    major: string
    courses: string[]
}

type ProgramListProps= {
    selectedProgramIndex: number
    programs: Program[]
    handleProgramClick: (program: Program) => void
}

export default function ProgramLists({programs, selectedProgramIndex, handleProgramClick}: ProgramListProps) {
    // Function used to always keep the active program in view of user
    function scrollActiveProgramIntoView(index: number){
        const activeProgram = document.getElementById
        (`program-${index}`)
        if(activeProgram){
            activeProgram.scrollIntoView({
            block: "nearest",inline: "start",
            behavior: "smooth"
            })
        }
    }

    // Renders the search bar to reflect function above
    useEffect(() => {
        if(selectedProgramIndex !== -1){
            scrollActiveProgramIntoView(selectedProgramIndex)
        }
    }, [selectedProgramIndex])

    return (
        <div className="bg-white max-h-96 overflow-y-scroll">
            {programs.map((program,index) => (
                <div key={program.ind} className={`${selectedProgramIndex === index ? "bg-gray-200" : ""} py-2 px-4 flex items-center justify-between gap-8 hover:bg-gray-200 cursor-pointer`}
                id={`program-${index}`}
                onClick={() => handleProgramClick(program)}>
                    <p>{program.major}</p>
                </div>
            ))}
        </div>
    )
}