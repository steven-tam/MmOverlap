
import './App.css'
import LandingPage from './pages/LandingPage'
import CoursePage from './pages/CoursePage'
import ResultsPage from './pages/ResultsPage'

import {BrowserRouter, Routes, Route} from "react-router-dom";
import Footer from './components/Footer'
import Navbar from './components/Navbar'

function App() {
  return (
    <div>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="selectCourses" element={<CoursePage />} />
          <Route path="showResults" element={<ResultsPage />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App
