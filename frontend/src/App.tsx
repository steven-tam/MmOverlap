import { useEffect, useState } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage'
import CoursePage from './pages/CoursePage'
import ProgressPage from './pages/ProgressPage'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Footer from './components/Footer'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="your-courses" element={<CoursePage />} />
          <Route path="progress-report" element={<ProgressPage />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default App
