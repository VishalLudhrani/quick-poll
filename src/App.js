// import modules
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// import styles, and/or components
import LandingPage from './pages/LandingPage';
import CastVote from './pages/CastVote';
import Result from './pages/Result';
import NewPoll from './pages/NewPoll';

export const supabaseClient = createClient(process.env.REACT_APP_SUPABASE_PROJECT_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/new' element={<NewPoll />} />
        <Route path='/vote/:id' element={<CastVote />} />
        <Route path='/result/:id' element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
