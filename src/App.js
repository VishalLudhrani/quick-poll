// import modules
import React from 'react';

// import styles, and/or components
import './App.css';

const App = () => {
  return (
    <div className="App">
      <div className="container mx-auto mt-40 space-y-8">
        <h1 className="text-9xl font-bold">Quick Poll</h1>
        <p className="text-4xl font-normal">A quick, open poll creator. View your poll results live. No limit on number of questions per poll. Create poll without signing in.</p>
        <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 text-2xl rounded-full text-indigo-50">Create poll</button>
      </div>
    </div>
  );
}

export default App;
