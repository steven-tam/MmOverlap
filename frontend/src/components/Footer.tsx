import React from 'react'
import DevCard from './DevCard'
const Footer = () => {
  return (
    <div className="border-t">
      <div className="flex flex-col md:flex-row justify-center gap-2">
        <DevCard name="person1" 
          title='Software' 
          image='https://picsum.photos/200' 
          githubLink='#' 
          portfolioLink='#'
          linkedinLink='#'
          />
        <DevCard 
          name="person2" 
          title='Software' 
          image='https://picsum.photos/200'
          githubLink='#' 
          portfolioLink='#'
          linkedinLink='#'
        />
        <DevCard 
          name="person3" 
          title='Software' 
          image='https://picsum.photos/200'
          githubLink='#' 
          portfolioLink='#'
          linkedinLink='#'
        />
      </div>
      <footer className="rounded-lg shadow m-4 dark:bg-gray-800">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 
            <a href="#" className="hover:underline">Gopher Major Planner™</a>. All Rights Reserved.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
              <li>
                  <a href="#" className="hover:underline me-4 md:me-6">About</a>
              </li>
              <li>
                  <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
              </li>
              <li>
                  <a href="https://umn.lol/" target="_blank" className="hover:underline me-4 md:me-6">Gopher Grades</a>
              </li>
              <li>
                  <a href="#" className="hover:underline">Contact</a>
              </li>
          </ul>
        </div>
      </footer>
    </div>
  )
}

export default Footer
