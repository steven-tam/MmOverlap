import linkedinIcon from '../assets/linkedin.svg'
import githubIcon from '../assets/Octicons-mark-github.svg'
import portfolioIcon from '../assets/portfolio.svg'

type ProfileProps = {
    name: string
    image: string
    githubLink: string
    portfolioLink: string
    linkedinLink: string
}

function DevCard({name, image, linkedinLink ,githubLink, portfolioLink}: ProfileProps) {
  return (
    <div>
        <div className="w-[170px] mx-auto my-6 bg-opacity-0 rounded-lg p-5 flex justify-center border-b-4">
            <div>
              <img className="w-24 h-24 rounded-full mx-auto border-4 border-light-gold hover:animate-bounce-twice" src={image} alt="Profile picture" title={name} />
              <h2 className="text-center text-2xl font-semibold mt-3 text-light-maroon">{name}</h2>
              <div className="flex justify-center mt-3">
                <a href={linkedinLink} className="mx-2 text-github-black hover:underline hover:text-github-black"><img src={linkedinIcon} alt='Linkedin'></img></a>
                <a href={githubLink} className="mx-2 text-github-black hover:underline hover:text-github-black"><img src={githubIcon} alt='Github'></img></a>
                <a href={portfolioLink} className="mx-2 text-github-black hover:underline hover:text-github-black"><img src={portfolioIcon} alt='Portfolio'></img></a>
              </div>
            </div>
        </div>
    </div>
  )
}

export default DevCard
