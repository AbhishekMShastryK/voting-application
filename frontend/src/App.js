import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SignUp from "./components/SignUp";
import VoterHomePage from "./components/VoterHomePage"; // Import HomePage component
import LogIn from './components/LogIn';
import AdminHomePage from "./components/AdminHomePage";
import ElectionSetup from './components/ElectionSetup';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/voterhome" element={<VoterHomePage />} />
          <Route path="/adminhome" element={<AdminHomePage />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/election-setup" element={<ElectionSetup/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;