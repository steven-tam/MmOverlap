type description = {
    description: string;
}

function ShowDescription({description}: description) {
  return (
    <div>
        <p className="text-gray-400 text-center mb-2">hint: you can pick a major you're interested in :)</p>
        <p className="text-4xl font-bold mb-1 shadow p-3 rounded">Program Description:</p> 
        <p className="h-[300px] md:w-full overflow-auto shadow p-3 text-lg rounded">{description}</p>
    </div>
  )
}

export default ShowDescription
