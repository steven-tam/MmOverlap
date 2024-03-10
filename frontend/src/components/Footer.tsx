import React from 'react'
import LeadDevCard from './LeadDevCard'
import DevCard from './DevCard'
const Footer = () => {
  return (
    <div className="border-t">
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <LeadDevCard name="Steven" 
          title='Website/Team Lead' 
          image='https://picsum.photos/200' 
          githubLink='#' 
          portfolioLink='#'
          linkedinLink='#'
          />
        <LeadDevCard 
          name="Sam" 
          title='Frontend Lead' 
          image='https://picsum.photos/200'
          githubLink='#' 
          portfolioLink='#'
          linkedinLink='#'
        />
        <LeadDevCard 
          name='Benat' 
          title='Data Science Lead' 
          image='https://picsum.photos/200'
          githubLink='#' 
          portfolioLink='#'
          linkedinLink='#'
        />
      </div>
      
      <div className="flex flex-col md:flex-row justify-center gap-4">
        
        <DevCard
          name='person4'
          image='https://picsum.photos/200'
          githubLink='#' 
          portfolioLink='#'
          linkedinLink='#'
        />

      </div>
      
      <p className='text-center text-gray-400'>
        Gopher Major Planner uses data from Summer 2017 to Fall 2023 provided by the <a href="https://idr.umn.edu/" target="_blank" className="hover:underline">Office of Institutional Data and Research</a>
      </p>
      <footer className="rounded-lg shadow m-4 dark:bg-gray-800">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 
            <a href="https://github.com/stevennTam/MmOverlap" target="_blank" className="hover:underline">Gopher Major Planner</a>. Contribute to our Github!
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
              <li>
                  <a href="#" className="hover:underline me-4 md:me-6">About</a>
              </li>
              <li>
                  <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
              </li>
              <li>
                  <a href="https://www.socialcoding.net/" target="_blank" className="hover:underline me-4 md:me-6">Social Coding Club</a>
              </li>
              <li>
                  <a href="https://umn.lol/" target="_blank" className="hover:underline">Gopher Grades</a>
              </li>
          </ul>
        </div>
      </footer>
    </div>
  )
}

export default Footer
