import { useEffect, useState } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage'
import CoursePage from './pages/CoursePage'
import ProgressPage from './pages/ProgressPage'
import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="your-courses" element={<CoursePage />} />
            <Route path="progress-report" element={<ProgressPage />} />
          </Routes>
        </BrowserRouter>
    </>
  );
}

export default App
