type description = {
    description: string;
}
//For some reason only <h1> works
function ProgramDescription({description}: description) {
  return (
    <div>
        <h2 className="text-4xl font-bold mb-1 shadow p-3 rounded">Program Description:</h2> 
        <p className="h-[300px] md:w-full overflow-auto shadow p-3 text-lg rounded">{description}</p>
    </div>
  )
}

export default ProgramDescription
