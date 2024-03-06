import logo from '../assets/gmplogo.svg'
import { useState } from 'react'
import {Squash as Hamburger} from 'hamburger-react'

const Navbar = () => {
  const [toggle, setToggle] = useState<boolean>(false) // Menu is closed by default
  
  return (
    <div className = "md:w-auto md:max-w-[1280px] h-[60px] bg-white border-b">
      <div className='flex justify-between'>
        <Hamburger label="Show menu" direction="right" toggled={toggle} toggle={setToggle} />
        <div className='md:max-w-[1080px] max-w-[600px] m-auto w-full h-full flex justify-center items-center'>
          <img src={logo} className="h-[85px] mt-[-30px]"></img>
        </div>
      </div>
       
      <nav className={toggle?'absolute mt-4 z-10 p-6 bg-white w-[95%] px-8 shadow-md':'hidden' }>
        <ul className='flex flex-col gap-4'>
            <li><a href="/" className='block p-2 pl-4 hover:bg-gray-100 rounded-md w-5/6 sm:w-auto md:max-w-[1180px]'>Home</a></li>
            <li><a href="/selectCourses" className='block p-2 pl-4 hover:bg-gray-100 rounded-md w-5/6 sm:w-auto md:max-w-[1180px]'>Select Courses</a></li>
            <li><a href="/showProgress" className='block p-2 pl-4 hover:bg-gray-100 rounded-md w-5/6 sm:w-auto md:max-w-[1180px]'>Show Progress</a></li>
            <li><a href="/example" className='block p-2 pl-4 hover:bg-gray-100 rounded-md w-5/6 sm:w-auto md:max-w-[1180px]'>Example</a></li>
        </ul>
      </nav>

    </div>
  )
}

export default Navbar
