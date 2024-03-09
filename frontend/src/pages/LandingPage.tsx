import { useEffect, useState } from 'react'
import ProgramSearchBar from '../components/ProgramSearchBar'

function LandingPage() {
 
  return (
    <div> 
      <h1 className='font-bold mb-1 underline mt-10 text-center'>Enter your Major</h1>
      <ProgramSearchBar></ProgramSearchBar>
    </div>
  )
}

export default LandingPage