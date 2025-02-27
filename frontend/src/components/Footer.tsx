import LeadDevCard from './LeadDevCard'
const Footer = () => {
  const defaultImg= "https://assets.milestoneinternet.com/cdn-cgi/image/f=auto/hotel-nikko-san-francisco/hotelnikkosf/mainimages/golden-gate-bridge-detailpage-hero.jpg?width=970&height=650"
  //https://picsum.photos/200
  return (
    <div className="border-t">
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <LeadDevCard name="Steven" 
          title='Website/Team Lead' 
          image={defaultImg} 
          githubLink='https://github.com/stevennTam/' 
          portfolioLink='#'
          linkedinLink='https://www.linkedin.com/in/steven-tam-a29239180/'
          />
        <LeadDevCard 
          name="Sam" 
          title='Frontend Lead' 
          image={defaultImg}
          githubLink='#' 
          portfolioLink='#'
          linkedinLink='#'
        />
        <LeadDevCard 
          name='Benat' 
          title='Data Science Lead' 
          image={defaultImg}
          githubLink='#' 
          portfolioLink='#'
          linkedinLink='#'
        />

        <LeadDevCard 
          name='Peiyuan' 
          title='Developer' 
          image={defaultImg}
          githubLink='#' 
          portfolioLink='#'
          linkedinLink='#'
        />
      </div>
      
      {/* <div className="flex flex-col md:flex-row justify-center gap-4">
        <DevCard
          name='person5'
          image={defaultImg}
          githubLink='#' 
          portfolioLink='#'
          linkedinLink='#'
        />

      </div> */}
      
      <p className='text-center text-gray-400'>
        Gopher Major Planner uses data from Summer 2017 to Fall 2023 provided by the <a href="https://idr.umn.edu/" target="_blank" className="hover:underline">Office of Institutional Data and Research</a>
      </p>
      <footer className="rounded-lg shadow m-4">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 Gopher Major Planner
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
              <li>
                  <a href="https://github.com/chaunmt/Interactive-Prerequisite-Flowchart" target="_blank" className="hover:underline me-4 md:me-6">Interactive Prerequisite-Flowchart</a>
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
