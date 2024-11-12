import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Box from '@mui/material/Box';
import './App.css'; 
import NavBar from './Components/NavBar';
import Footer from './Components/Footer';
import Home from './Components/Home/Home';
import JobPostings from './Components/JobPostings';
import AssessmentManager from './Components/Assesments';
import CandidateList from './Components/Candidates';

function App() {
  return (
    <Router>
      <NavBar/>
      <div className='landing-main'>

      
      <Routes>
        <Route path="/"  element={<Home/>}  />
        <Route path="/jobs"  element={<JobPostings/>}  />
        <Route path="/assesments"  element={<AssessmentManager/>}  />
        <Route path="/candidates"  element={<CandidateList/>}  />
        
          
        
        
      </Routes>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;
