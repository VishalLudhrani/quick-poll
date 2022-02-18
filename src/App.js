// import modules
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import styles, and/or components
import './App.css';
import LandingPage from "./components/LandingPage";
import CastVote from './components/Poll/CastVote';
import CreateNewPoll from './components/Poll/CreateNewPoll';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/poll/new" element={<CreateNewPoll />} />
        <Route path="/poll/vote" element={<CastVote />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
