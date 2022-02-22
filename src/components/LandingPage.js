import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {

  const navigate = useNavigate();

  const onCreateBtnHandler = () => {
    navigate("/new");
  }

  return (
    <>
      <div className="App">
        <div className="content-container">
          <h1 className="text-7xl font-black md:text-9xl">Quick Poll</h1>
          <p className="text-2xl font-thin md:text-4xl">A quick, open poll creator. View your poll results live. No limit on number of questions per poll. Create poll without signing in.</p>
          <button className="btn-contained" onClick={onCreateBtnHandler}>Create poll</button>
        </div>
      </div>
    </>
  );

};

export default LandingPage;