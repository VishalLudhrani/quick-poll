// import modules
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// import styles, and/or components
import './App.css';
import LandingPage from './components/LandingPage';
import CastVote from './components/Poll/CastVote';
import CreateNewPoll from './components/Poll/CreateNewPoll';
import Result from './components/Poll/Result';

export const supabaseClient = createClient(process.env.REACT_APP_SUPABASE_PROJECT_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/new' element={<CreateNewPoll />} />
        <Route path='/vote/:id' element={<CastVote />} />
        <Route path='/result/:id' element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
