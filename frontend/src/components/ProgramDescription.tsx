type description = {
    description: string;
}

function ProgramDescription({description}: description) {
  return (
    <div>
        <h1 className="font-bold mb-1 shadow p-3 rounded">Program Description:</h1>
        <p className="h-[300px] md:w-full overflow-auto shadow p-3 text-lg font-bold rounded">{description}</p>
    </div>
  )
}

export default ProgramDescription
